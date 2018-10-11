import {Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import {UpdateService} from "../services/update.service";
import {IKeyPress, IPlayerObject} from "../interface";
import {LightService} from "../services/light.service";
import {SkyBoxService} from "../services/skybox.service";
import {LoaderService} from "../services/loader.service";
import {PhysicsService} from "../services/physics.service";
import {KeyService} from "../services/key.service";
import {MultiplayerService} from "../services/multiplayer.service";

import {WebSocketService} from "../services/webSocket.service";
import {Subscription} from "rxjs";
import {AnimationService} from "../services/animation.service";
import {PlayerService} from "../services/player.service";
import {ApiService} from "../services/api.service";

import * as THREE from 'three'

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
})
export class GameComponent {

    gui = {
        gravity: 0,
        lapTime: 0
        // bestLap : 100,
    };

    general = {
        dt: 0,
        last: 0,
        frame: 0,
        fps: 0
    };

    keys: IKeyPress = {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false
    };

    player: THREE.Object3D; // 3D model of the player
    light: THREE.Light;
    pointLight: THREE.Light;
    skyBox: THREE.Object3D;
    level: THREE.Object3D;

    state = {
        dead: false
    };

    currentPlayer: IPlayerObject; // is the object of the player state
    connectedPlayers: IPlayerObject[] = [];

    scene: any = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 200000);
    renderer = new THREE.WebGLRenderer();

    @ViewChild("canvas") _canvas: ElementRef;

    //setup webSocket service;
    private _socketService: WebSocketService = new WebSocketService();
    private _animationService: AnimationService = new AnimationService();

    constructor(private _updateService: UpdateService,
                private _lightService: LightService,
                private _loader: LoaderService,
                private _physicsService: PhysicsService,
                private _keyService: KeyService,
                private _multiplayerService: MultiplayerService,
                private _player: PlayerService,
                private _skyBoxService: SkyBoxService,
                private _apiService: ApiService
    ) {
        this.setupSubscriptions();
        this.setupCurrentPlayer();
        this._updateService.init(this.currentPlayer.bike);

        // connect to game and load level
        this._socketService
            .connectToGame(this.currentPlayer, this._apiService.getToken())
            .then((res: any) => {
                this.connectedPlayers = res.playerList;
                this.currentPlayer.ID = res.ID;
                if (this.connectedPlayers.length > 0) {
                    console.log('there are other players in scene');
                    this._multiplayerService.initializePlayers(this.scene, this.connectedPlayers)
                        .then(() => this.loadCurrentGame())
                } else {
                    this.loadCurrentGame()
                }
            })
            .catch((err: any) => {
                console.log('starting a offline game');
                this.loadCurrentGame();
            })
    }

    //***********************
    //setup key handlers
    //***********************

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.keys = this._keyService.onKeyPress(event, true);
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent) {
        this.keys = this._keyService.onKeyPress(event, false);
    }

    handleClickEvents(event: any, mouseDown: boolean) {
        this.keys = this._keyService.onClickEvent(event, mouseDown);
    }

    handleMouseMovement(event: any) {
        this.keys = this._keyService.onMouseMovement(event);
    }

    //***********************
    //on component load
    //***********************

    connection: Subscription;
    newPlayerConnect: Subscription;
    animateSubscription: Subscription;
    onPlayerdisconnect: Subscription;

    setupCurrentPlayer() {
        this.currentPlayer = {
            ID: 'NULL',
            position: {
                x: 0,
                y: 0,
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            acceleration: 0,
            name: "test2",
            bike: this._player.getBike()
        };
    }

    setupSubscriptions() {
        //returns new player positions
        this.connection = this._socketService.getPlayerPositions()
            .subscribe((playerList: [IPlayerObject]) => {
                console.log('get player pos');
                this.connectedPlayers = playerList;
            });

        //returns a trigger when a new player connects
        this.newPlayerConnect = this._socketService.getNewPlayer()
            .subscribe((player: IPlayerObject) => {
                console.log('new Player Connected');
                this._multiplayerService.startNewPlayer(this.scene, player)
            });

        //returns a trigger when a new player disconnects
        this.onPlayerdisconnect = this._socketService.onDisconnect()
            .subscribe((id: string) => {
                console.log('PlayerDisconnected');
                this._multiplayerService.deletePlayer(this.scene, id)
            });

        //returns a trigger when scene must be updated
        this.animateSubscription = this._animationService.animation()
            .subscribe((generalObject: any) => {
                this.general = generalObject;
                this.render();
            });
    }

    loadCurrentGame() {
        this.light = this._lightService.addAmbientLight(0xddbfbf);
        this.pointLight = this._lightService.addPointLight();

        this._loader.loadOBJ(this.currentPlayer.bike.Bike, this.currentPlayer.bike.Texture, "bike")
            .then((player: THREE.Object3D) => {
                player.name = "player";
                this.player = player;

                this._skyBoxService.init("skySphere_5.jpg")
                    .then((skybox: THREE.Object3D) => {
                        skybox.name = "skyBox";
                        this.skyBox = skybox;

                        const level = "assets/objects/lennart_level_06.obj";
                        const levelText = "assets/textures/tron.png";

                        this._loader.loadOBJ(level, levelText, "level")
                            .then((level: THREE.Object3D) => {
                                level.name = "model";
                                this.level = level;
                                this.setup();
                            });
                    });
            });
    }

    reloadGame() {
        this.state.dead = false;
        this.player.position.x = 0;
        this.player.position.y = 0;
        this.player.position.z = 0;
        this.player.rotation.x = 0;
        this.player.rotation.y = 0;
        this.player.rotation.z = 0;
        this.currentPlayer.acceleration = 0;
        this.skyBox.position.copy(this.player.position);
        this.camera.position.copy(this.player.position);
        this._updateService.reset();

        this._animationService.startAnimation();
    }

    //***********************
    //setup
    //***********************

    setup() {
        this.setupInitState();
        this.addObjectsToScene();
        this.addBoundingBoxesToScene();
        this._canvas.nativeElement.appendChild(this.renderer.domElement);
        this._physicsService.setupGravity(this.scene);
        this._animationService.startAnimation();
    }

    setupInitState() {
        this.skyBox.position.copy(this.camera.position);
        this.pointLight.position.copy(this.camera.position);
        this.renderer.setSize(1280, 720);
    }

    addObjectsToScene() {
        this.player.position.y = 100;
        this.scene.add(this.player);
        this.scene.add(this.level);
        this.scene.add(this.light);
        this.scene.add(this.pointLight);
        this.scene.add(this.skyBox);
    }

    addBoundingBoxesToScene() {
        const geometry2 = new THREE.BoxGeometry(60000, 1, 60000);
        const material2 = new THREE.MeshBasicMaterial();

        material2.visible = false;
        const cube2 = new THREE.Mesh(geometry2, material2);

        cube2.position.y = -8000;
        cube2.name = "death";

        this.scene.add(cube2);
    }

    //***********************
    //Rendering
    //***********************

    render() {
        const physics = this._physicsService.GravityCheck(this.player, this.camera);

        if (physics.death) {
            this._animationService.stopAnimation();
            this.state.dead = true;
            return;
        }

        this._updateService.update(this.player, this.camera, this.currentPlayer, this.keys, this.general.dt, physics.gravity);

        this.gui.lapTime = physics.lap;

        if (this.general.frame % 4 == 0 && this._socketService.socket.connected) {
            this._multiplayerService.SendPlayerUpdate(this.player, this.currentPlayer, this.connectedPlayers);
        } else {
            this._multiplayerService.RenderOtherPlayersPosition(this.general.dt, this.connectedPlayers)
        }

        this.gui.gravity = physics.gravity;

        // keep skyBox around bike
        this.skyBox.position.copy(this.player.position);

        // render scene
        this.renderer.render(this.scene, this.camera);
    }
}

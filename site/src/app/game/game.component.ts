import {Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import {UpdateService} from "../services/update.service";
import {IKeyPress, IGravityCheckReturn, IPlayerObject} from "../interface";
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


@Component({
    selector: 'game',
    templateUrl: './game.component.html',
})
export class GameComponent {
    gui = {
        speed : 0,
        gravity : 0,
        lapTime : 0
        // bestLap : 100,
    };

    loaded = {
        level: false,
        user: false,
        skybox: false,
    };

    general = {
        dt : 0,
        last : 0,
        frame : 0
    };

    keys : IKeyPress = {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false
    };

    player : THREE.Object3D;
    light : THREE.Light;
    pointLight : THREE.Light;
    skyBox : THREE.Object3D;
    level: THREE.Object3D;

    state = {
        dead : false
    };

    currentPlayer : IPlayerObject;
    connectedPlayers : IPlayerObject[] = [];


    scene: any = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 200000);
    renderer = new THREE.WebGLRenderer();

    @ViewChild("canvas") _canvas: ElementRef;

    //setup webSocket service;
    private _socketService: WebSocketService = new WebSocketService();

    constructor(private _updateService: UpdateService,
                private _lightService: LightService,
                private _loader: LoaderService,
                private _physicsService: PhysicsService,
                private _keyService: KeyService,
                private _multiplayerService: MultiplayerService,
                private _animationService: AnimationService,
                private _player: PlayerService,
                private _skyBoxService: SkyBoxService) {

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

    //***********************
    //on component load
    //***********************

    connection : Subscription;
    newPlayerConnect : Subscription;
    animateSubscription : Subscription;
    onPlayerdisconnect : Subscription;


    ngOnInit() {
        this.setupSubscriptions();
        this.setupCurrentPlayer();

        //connect to game and load level:
        this._socketService.connectToGame(this.currentPlayer)
            .then((res : any) => {
                this.connectedPlayers = res.playerList;
                if (this.connectedPlayers.length > 0) {
                    console.log('there are other players in scene');
                    this._multiplayerService.initializePlayers(this.scene, this.connectedPlayers)
                        .then(() => this.loadCurrentGame())
                } else {
                    this.loadCurrentGame()
                }
            })
    }

    setupCurrentPlayer() {
        this.currentPlayer = {
            ID : 'NULL',
            position :{
                x: 0,
                y: 0,
                z: 0
            },
            rotation :{
                x: 0,
                y: 0,
                z: 0
            },
            name : "test2",
            bike : this._player.getBike(),
            bikeTexture : this._player.getTexture()
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

        this._loader.loadOBJ(this.currentPlayer.bike, this.currentPlayer.bikeTexture).then(
            (res: THREE.Object3D) => {
                res.name = "player";
                this.player = res;
                this.handleLoaded("user");
            }
        );

        const level = require("../../../assets/objects/level_lennart_2.obj");
        const levelText = require("../../../assets/textures/tron-02.jpg");
        this._loader.loadOBJ(level, levelText).then(
            (res: THREE.Object3D) => {
                res.name = "model";
                this.level = res;
                this.handleLoaded("level");
            }
        );

        this._skyBoxService.init().then(
            (res: THREE.Object3D) => {
                res.name = "skyBox";
                this.skyBox = res;
                this.handleLoaded("skybox");
            }
        );
    }

    //handles async loading on components
    handleLoaded(loadType : string) {
        this.loaded[loadType] = true;
        let ready = true;

        for (let x in this.loaded) {
            if (!this.loaded[x]) ready = false;
        }
        if (ready) {
            this.setup();
        }
    }

    reloadGame() {
        this.state.dead = false;
        this.player.position.x = 0;
        this.player.position.y = 0;
        this.player.position.z = 0;
        this.player.rotation.x = 0;
        this.player.rotation.y = 0;
        this.player.rotation.z = 0;
        this.skyBox.position.copy(this.player.position);
        this.camera.position.copy(this.player.position);
        this._updateService.reset();
        this.animate();
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

        this.animate();
    }

    setupInitState() {
        this.skyBox.position.copy(this.camera.position);
        this.pointLight.position.copy(this.camera.position);
        this.renderer.setSize(1280, 720);
    }

    addObjectsToScene() {
        this.scene.add( this.player );
        this.scene.add( this.level );
        this.scene.add( this.light );
        this.scene.add( this.pointLight );
        this.scene.add( this.skyBox );
    }

    addBoundingBoxesToScene() {
        const geometry2 = new THREE.BoxGeometry( 60000, 1, 60000 );
        const material2 = new THREE.MeshBasicMaterial();
        material2.visible = false;
        const cube2 = new THREE.Mesh( geometry2, material2 );
        cube2.position.y = -2000;
        cube2.name = "death";
        this.scene.add( cube2 );
    }

    //***********************
    //animations
    //***********************

    animate() {
        const now = new Date().getTime();
        this.general.dt = Math.min(1, (now - this.general.last) / 1000);
        this.general.last = now;
        this.render();
        if (!this.state.dead) {
            this.general.frame++;
            if (this.general.frame > 24) {
                this.general.frame = 0;
            }
            requestAnimationFrame(() => this.animate());
        }
    }

    render() {
        this.gui.speed = this._updateService.update(this.player, this.camera, this.keys, this.general.dt);
        const obj : IGravityCheckReturn = this._physicsService.GravityCheck(this.player, this.camera);
        if (obj.d) {
            this.state.dead = true;
        }
        this.gui.lapTime = obj.lt;

        if (this.general.frame % 4 == 0) {
            //update player here
            this.currentPlayer.position.x = this.player.position.x;
            this.currentPlayer.position.y = this.player.position.y;
            this.currentPlayer.position.z = this.player.position.z;
            this.currentPlayer.rotation.x = this.player.rotation.x;
            this.currentPlayer.rotation.y = this.player.rotation.y;
            this.currentPlayer.rotation.z = this.player.rotation.z;

            this._socketService.sendPlayerPosition(this.currentPlayer)
                .then((data : any) => {
                    this.connectedPlayers = data;
                    this._multiplayerService.updateOtherPlayers(this.connectedPlayers)
                });
        }

        this.gui.gravity = obj.g;
        //keep skyBox around bike
        this.skyBox.position.copy(this.player.position);
        this.renderer.render(this.scene, this.camera);
    }
}
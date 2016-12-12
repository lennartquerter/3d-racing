import {Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import {UpdateService} from "./services/update.service";
import {IKeyPress, IGravityCheckReturn, IPlayerObject} from "./interface";
import {LightComponent} from "./light/light.component";
import {SkyboxComponent} from "./skybox/skybox.component";
import {LoaderService} from "./services/loader.service";
import {PhysicsService} from "./services/physics.service";
import {KeyService} from "./services/key.service";
import {MultiplayerService} from "./services/multiplayer.service";

import {WebSocketService} from "./services/webSocket.service";
import {Subscription} from "rxjs";


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    providers : [UpdateService,
        LightComponent,
        SkyboxComponent,
        LoaderService,
        PhysicsService,
        MultiplayerService,
        WebSocketService,
        KeyService]
})
export class AppComponent {
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

    players : [IPlayerObject] = [{
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
        name: 'player01',
        bike: 'bike01',
        bikeTexture: 'text01'
    }];


    scene: any = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 200000);
    renderer = new THREE.WebGLRenderer();

    @ViewChild("canvas") _canvas: ElementRef;

    constructor(private _updateService: UpdateService,
                private _lightComponent: LightComponent,
                private _loader: LoaderService,
                private _physicsService: PhysicsService,
                private _keyService: KeyService,
                private _multiplayerService: MultiplayerService,
                private _socketService: WebSocketService,
                private _skyboxComponent: SkyboxComponent) {

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
    ngOnInit() {
        this.connection = this._socketService.getMessages().subscribe(message => {
            console.log(message);
        })

        this._multiplayerService.initializePlayers(this.scene, this.players)
            .then(() => this.loader())
    }

    loader() {
        this.light = this._lightComponent.addAmbientLight();
        this.pointLight = this._lightComponent.addPointLight();

        const player = require("../../assets/objects/bike_2.obj");
        const playerText = require("../../assets/textures/tron.png");
        this._loader.loadOBJ(player, playerText).then(
            (res: THREE.Object3D) => {
                res.name = "player";
                this.player = res;
                this.handleLoaded("user");
            }
        );

        const level = require("../../assets/objects/level_lennart_2.obj");
        const levelText = require("../../assets/textures/road.jpg");
        this._loader.loadOBJ(level, levelText).then(
            (res: THREE.Object3D) => {
                res.name = "model";
                this.level = res;
                this.handleLoaded("level");
            }
        );

        this._skyboxComponent.init().then(
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
        console.log(this.player.position)
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
            const playerPos :IPlayerObject = {
                position :{
                    x: this.player.position.x,
                    y: this.player.position.y,
                    z: this.player.position.z
                },
                rotation :{
                    x: this.player.rotation.x,
                    y: this.player.rotation.y,
                    z: this.player.rotation.z
                },
                name : "player01",
                bike : 'bike01',
                bikeTexture : "blue"
            };
            this._multiplayerService.updateOtherPlayers(this.players);
            this._socketService.sendPlayerPosition( playerPos);
        }

        this.gui.gravity = obj.g;
        //keep skyBox around bike
        this.skyBox.position.copy(this.player.position);
        this.renderer.render(this.scene, this.camera);
    }
}
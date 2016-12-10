import {Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import {UpdateService} from "./services/update.service";
import {IKeyPress} from "./interface";
import {LightComponent} from "./light/light.component";
import {SkyboxComponent} from "./skybox/skybox.component";
import {LoaderService} from "./services/loader.service";
import {PhysicsService} from "./services/physics.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    providers : [UpdateService, LightComponent, SkyboxComponent, LoaderService, PhysicsService]
})
export class AppComponent {
    gui = {
        speed : 0
    };

    loaded = {
        level: false,
        user: false,
        skybox: false,
    };
    
    general = {
        dt : 0,
        last : 0,
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
    }

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 200000);
    renderer = new THREE.WebGLRenderer();

    @ViewChild("canvas") _canvas: ElementRef;

    constructor(private _updateService: UpdateService,
                private _lightComponent: LightComponent,
                private _loader: LoaderService,
                private _physicsService: PhysicsService,
                private _skyboxComponent: SkyboxComponent) {

    }

    //***********************
    //setup key handlers
    //***********************

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.onKeyPress(event, true);
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent) {
        this.onKeyPress(event, false);
    }

    onKeyPress(event: any, down:boolean) {
        if (event.key == 'w' || event.keyCode == 38) {
            this.keys.UP = down;
        } else if (event.key == 's' || event.keyCode == 40) {
            this.keys.DOWN = down;
        } else if (event.key == 'a' || event.keyCode == 37) {
            this.keys.LEFT = down;
        } else if (event.key == 'd' || event.keyCode == 39) {
            this.keys.RIGHT = down;
        }
    }

    //***********************
    //on component load
    //***********************

    ngOnInit() {
        this.light = this._lightComponent.init();
        this.pointLight = this._lightComponent.addPointLight();

        const player = require("../../assets/objects/bike_lennart.obj");
        const playerText = require("../../assets/textures/tron.png");
        this._loader.loadOBJ(player, playerText).then(
            (res: THREE.Object3D) => {
                res.name = "player";
                this.player = res;
                this.handleLoaded("user");
            }
        );

        const level = require("../../assets/objects/level_lennart.obj");
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

    //***********************
    //setup
    //***********************

    setup() {
        this.setupInitState();
        this.addObjectsToScene();
        this.addBoundingBoxesToScene();
        this._canvas.nativeElement.appendChild(this.renderer.domElement);
        this._physicsService.setupGravity(this.scene, 7.8);
        this.animate()
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
        const geometry = new THREE.BoxGeometry( 2500, 1, 65000 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = -100;
        cube.name = "ground";
        this.scene.add( cube );

        const geometry3 = new THREE.BoxGeometry( 14000, 1, 2500 );
        const cube3 = new THREE.Mesh( geometry3, material );
        cube3.position.y = -100;
        cube3.position.x = -7000;
        cube3.position.z = -33000;
        cube3.name = "ground";
        this.scene.add( cube3 );


        const geometry4 = new THREE.BoxGeometry( 20000, 1, 2500 );
        const cube4 = new THREE.Mesh( geometry4, material );
        cube4.position.y = 675;
        cube4.position.x = -16000;
        cube4.position.z = -33000;
        cube4.rotation.z = -0.24;
        cube4.name = "ground";
        this.scene.add( cube4 );

        const geometry2 = new THREE.BoxGeometry( 60000, 1, 60000 );
        const material2 = new THREE.MeshBasicMaterial();
        material2.visible = false;
        const cube2 = new THREE.Mesh( geometry2, material2 );
        cube2.position.y = - 1000;
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
        const death = this.render();
        if (!death) {
            requestAnimationFrame(() => this.animate());
        }
    }

    render() {
        this.gui.speed = this._updateService.update(this.player, this.camera, this.keys, this.general.dt);
        const death = this._physicsService.GravityCheck(this.player);
        if (death) {
            this.state.dead = true;
            return true;
        }
        //keep skybox around bike
        this.skyBox.position.copy(this.player.position);
        this.renderer.render(this.scene, this.camera);
        return false;
    }
}
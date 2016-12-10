import {Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import {UpdateService} from "./services/update.service";
import {IKeyPress} from "./interface";
import {LightComponent} from "./light/light.component";
import {SkyboxComponent} from "./skybox/skybox.component";
import {LoaderService} from "./services/loader.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    providers : [UpdateService, LightComponent, SkyboxComponent, LoaderService]
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

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 100000);
    renderer = new THREE.WebGLRenderer();

    @ViewChild("canvas") _canvas: ElementRef;

    constructor(private _updateService: UpdateService,
                private _lightComponent: LightComponent,
                private _loader: LoaderService,
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
                this.player = res;
                this.handleLoaded("user");
            }
        );

        const level = require("../../assets/objects/level_lennart.obj");
        const levelText = require("../../assets/textures/road.jpg");
        this._loader.loadOBJ(level, levelText).then(
            (res: THREE.Object3D) => {
                this.level = res;
                // var bbox = new THREE.Box3().setFromObject(this.level);
                // console.log(bbox);
                this.handleLoaded("level");
            }
        );

        this._skyboxComponent.init().then(
            (res: THREE.Object3D) => {
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
        this._canvas.nativeElement.appendChild(this.renderer.domElement);
        this.animate()
    }

    setupInitState() {
        // this.camera.position.z = 800;
        // this.camera.position.y = 200;
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

    //***********************
    //animations
    //***********************

    animate() {
        const now = new Date().getTime();
        this.general.dt = Math.min(1, (now - this.general.last) / 1000);
        this.general.last = now;
        this.render();
        requestAnimationFrame(() => this.animate());
    }

    render() {
        this.gui.speed = this._updateService.update(this.player, this.camera, this.keys, this.general.dt);
        //keep skybox around bike
        this.skyBox.position.copy(this.player.position);
        this.renderer.render(this.scene, this.camera);
    }
}
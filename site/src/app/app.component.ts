import {Component, ViewChild, ElementRef, HostListener} from '@angular/core';
import {CarComponent} from "./car/car.component";
import {IKeyPress} from "./interface";
import {LightComponent} from "./light/light.component";
import {SkyboxComponent} from "./skybox/skybox.component";
import {LoaderService} from "./services/loader.service";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    providers : [CarComponent, LightComponent, SkyboxComponent, LoaderService]
})
export class AppComponent {

    gui = {
        speed : 0
    };
    
    general = {
        dt : 0,
        last : 0,
    };

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 100000);

    // car = this._carComponent.init();
    car : any;
    light : any;
    pointLight : any;
    skyBox : any;
    level: any;

    renderer = new THREE.WebGLRenderer();

    keys : IKeyPress = {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false
    };

    @ViewChild("canvas") _canvas: ElementRef;

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.onKeyPress(event, true);
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyUp(event: KeyboardEvent) {
        this.onKeyPress(event, false);
    }

    constructor(private _carComponent: CarComponent,
                private _lightComponent: LightComponent,
                private _loader: LoaderService,
                private _skyboxComponent: SkyboxComponent) {

    }

    ngOnInit() {


        const bike = require("../../assets/objects/bike_lennart.obj");
        this._loader.loadOBJ(bike).then(
            (res) => this.car = res
        );
        const level = require("../../assets/objects/level_lennart.obj");
        this._loader.loadOBJ(level).then(
            (res) => this.level = res
        );
        this.light = this._lightComponent.init();
        this.pointLight = this._lightComponent.addPointLight();
        this.skyBox = this._skyboxComponent.init();

       setTimeout(() => this.start(), 1000)
    }

    start() {
        this.camera.position.z = 600;
        this.camera.position.y = 200;
        this.skyBox.position.copy(this.camera.position);
        this.pointLight.position.copy(this.camera.position);
        this.scene.add( this.car );
        this.scene.add( this.level );
        this.scene.add( this.light );
        this.scene.add( this.pointLight );
        this.scene.add( this.skyBox );
        this.renderer.setSize(1280, 720);
        this._canvas.nativeElement.appendChild(this.renderer.domElement);
        setTimeout(() => this.animate(), 1000)
    }

    mouseMovement(event: any) {
        // console.dir(event);
        // this.camera.rotation.x += this.dt * -event.movementY / 10000;
        // this.camera.rotation.y += this.dt * -event.movementX / 10000;
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
    
    animate() {
        const now = new Date().getTime();
        this.general.dt = Math.min(1, (now - this.general.last) / 1000);
        this.general.last = now;
        this.draw();
        requestAnimationFrame(() => this.animate());
    }


    draw() {
        this.gui.speed = this._carComponent.move(this.car, this.camera,this.keys,this.general.dt);
        this.skyBox.position.copy(this.camera.position);
        this.renderer.render(this.scene, this.camera);
    }
}
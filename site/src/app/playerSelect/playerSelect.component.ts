/// <reference path="../../../../typings/index.d.ts" />


import {Component, ViewChild, ElementRef} from "@angular/core";
import {AnimationService} from "../services/animation.service";
import {Subscription} from "rxjs";
import {IGeneralObject} from "../interface";
import {LightService} from "../services/light.service";
import {SkyBoxService} from "../services/skybox.service";
import {LoaderService} from "../services/loader.service";
import {Router} from "@angular/router";
import {PlayerService} from "../services/player.service";

@Component({
    selector: 'player-select',
    templateUrl: './player-select.component.html',
})
export class PlayerSelectComponent {
    scene: any = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 200000);
    renderer = new THREE.WebGLRenderer();

    trackingBike : THREE.Vector3 = new THREE.Vector3(0,0,0);
    trackIndex = 0;

    t = 0;

    bike01 : THREE.Object3D;
    bike02 : THREE.Object3D;
    bike03 : THREE.Object3D;
    light : THREE.Light;
    pointLight01 : THREE.Light;
    pointLight02 : THREE.Light;
    pointLight03 : THREE.Light;
    skyBox : THREE.Object3D;

    loaded = {
        bike01: false,
        bike02: false,
        bike03: false,
        skybox: false,
    };

    general : IGeneralObject = {
        dt: 0,
        last: 0,
        frame: 0
    };

    textures = [require("../../../assets/textures/tron-01.jpg"), require("../../../assets/textures/tron-02.jpg"), require("../../../assets/textures/tron-03.jpg")];
    bikes = [require("../../../assets/objects/bike_2.obj"),require("../../../assets/objects/bike_2.obj"),require("../../../assets/objects/bike_2.obj")];

    @ViewChild("canvas") _canvas: ElementRef;

    animateSubscription : Subscription;

    constructor(
        private _animationService : AnimationService,
        private _lightService : LightService,
        private _loader : LoaderService,
        private _skyBoxService : SkyBoxService,
        private _player : PlayerService,
        private _router : Router
    ) {}

    ngOnInit() {
        this.loader();

        this.animateSubscription = this._animationService.animation().subscribe((generalObject : IGeneralObject) => {
            this.general = generalObject;
            this.render();
        });
    }


    loader() {
        this.light = this._lightService.addSoftAmbientLight();
        this.pointLight01 = this._lightService.createSpotLight(0xddbfbf);
        this.pointLight02 = this._lightService.createSpotLight(0xddbfbf);
        this.pointLight03 = this._lightService.createSpotLight(0xddbfbf);


        this._loader.loadOBJ(this.bikes[0], this.textures[0]).then(
            (res: THREE.Object3D) => {
                this.bike01 = res;
                this.handleLoaded("bike01");
            }
        );

        this._loader.loadOBJ(this.bikes[1], this.textures[1]).then(
            (res: THREE.Object3D) => {
                this.bike02 = res;
                this.handleLoaded("bike02");
            }
        );

        this._loader.loadOBJ(this.bikes[2], this.textures[2]).then(
            (res: THREE.Object3D) => {
                this.bike03 = res;
                this.handleLoaded("bike03");
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


    setup() {

        //camera and skybox
        this.camera.position.x = 500;
        this.camera.position.z = 500;
        this.camera.position.y = 175;

        this.skyBox.position.copy(this.camera.position);
        this.scene.add( this.skyBox );

        //bikes
        this.initBikes();

        //Lighting

        this.pointLight01.position.copy(this.bike01.position);
        this.pointLight02.position.copy(this.bike02.position);
        this.pointLight03.position.copy(this.bike03.position);

        this.pointLight01.position.y = 3000;
        this.pointLight02.position.y = 3000;
        this.pointLight03.position.y = 3000;

        this.pointLight01.lookAt(this.bike01.position);
        this.pointLight02.lookAt(this.bike02.position);
        this.pointLight03.lookAt(this.bike03.position);

        this.scene.add( this.pointLight01 );
        this.scene.add( this.pointLight02 );
        this.scene.add( this.pointLight03 );

        //renderer size

        this.renderer.setSize(1280, 720);

        //add and start

        this._canvas.nativeElement.appendChild(this.renderer.domElement);
        this._animationService.startAnimation();
    }

    initBikes() {

        //bikes:

        this.bike02.position.x = 1000;
        this.bike02.position.z = 1000;

        this.bike03.position.x = -1000;
        this.bike03.position.z = 1000;

        //cilinders:

        const geometry = new THREE.CylinderGeometry( 300, 300, 20, 64 );
        const material = new THREE.MeshBasicMaterial( {color: 0x4c4c4c} );

        const cylinder01 = new THREE.Mesh( geometry, material );
        const cylinder02 = new THREE.Mesh( geometry, material );
        const cylinder03 = new THREE.Mesh( geometry, material );

        cylinder01.position.copy(this.bike01.position);
        cylinder02.position.copy(this.bike02.position);
        cylinder03.position.copy(this.bike03.position);
        cylinder01.position.y = -20;
        cylinder02.position.y = -20;
        cylinder03.position.y = -20;


        this.scene.add( cylinder01 );
        this.scene.add( cylinder02 );
        this.scene.add( cylinder03 );
        this.scene.add( this.bike01 );
        this.scene.add( this.bike02 );
        this.scene.add( this.bike03 );
    }

    nextBike() {
        switch (this.trackIndex) {
            case 0:
                this.trackingBike = this.bike02.position;
                this.trackIndex = 1;
                break;
            case 1:
                this.trackingBike = this.bike03.position;
                this.trackIndex = 2;
                break;
            case 2:
                this.trackingBike = this.bike01.position;
                this.trackIndex = 0;
                break;
        }
    }

    render() {
        this.t += 0.01;
        this.camera.position.x = 500*Math.cos(this.t) + this.trackingBike.x;
        this.camera.position.z = 500*Math.sin(this.t) + this.trackingBike.z;
        this.camera.lookAt(this.trackingBike);
        this.renderer.render(this.scene, this.camera);
    }


    startRace() {
        this._animationService.stopAnimation();
        this._player.setTexture(this.textures[this.trackIndex]);
        this._player.setBike(this.bikes[this.trackIndex]);
        this._router.navigate(['/game']);
    }

}
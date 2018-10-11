import {Component, ViewChild, ElementRef, HostListener} from "@angular/core";
import {AnimationService} from "../services/animation.service";
import {Subscription} from "rxjs";
import {IGeneralObject, IBike, IBikeStats} from "../interface";
import {LightService} from "../services/light.service";
import {SkyBoxService} from "../services/skybox.service";
import {LoaderService} from "../services/loader.service";
import {Router} from "@angular/router";
import {PlayerService} from "../services/player.service";


import * as THREE from 'three'

@Component({
    selector: 'player-select',
    templateUrl: './player-select.component.html',
})

export class PlayerSelectComponent {
    scene: any = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1280 / 720, 1, 200000);
    renderer = new THREE.WebGLRenderer();

    trackingBike: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    bikeList: THREE.Object3D[] = [];
    trackIndex = 0;

    t = 0;

    light: THREE.Light;
    pointLightList: THREE.Light[] = [];
    skyBox: THREE.Object3D;

    loaded = {
        skybox: false
    };

    general: IGeneralObject = {
        dt: 0,
        last: 0,
        frame: 0
    };

    loaderList: IBike[] = [
        {
            Texture: "../../assets/textures/tron-01.jpg",
            Bike: "../../assets/objects/bike_2.obj",
            Name: 'bike-01',
            Stats: {
                Acceleration: 400,
                MaxSpeed: 700,
                Shield: 500,
                ShieldRechargeRate: 100,
                Handeling: 0.034
            }
        },
        {
            Texture: "../../../assets/textures/tron-02.jpg",
            Bike: "../../../assets/objects/bike_2.obj",
            Name: 'bike-02',
            Stats: {
                Acceleration: 500,
                MaxSpeed: 600,
                Shield: 400,
                ShieldRechargeRate: 130,
                Handeling: 0.042
            }
        },
        {
            Texture: "../../../assets/textures/tron-03.jpg",
            Bike: "../../../assets/objects/bike_2.obj",
            Name: 'bike-03',
            Stats: {
                Acceleration: 300,
                MaxSpeed: 700,
                Shield: 300,
                ShieldRechargeRate: 180,
                Handeling: 0.038
            }
        },
        {
            Texture: "../../../assets/textures/tron-04.jpg",
            Bike: "../../../assets/objects/bike_2.obj",
            Name: 'bike-04',
            Stats: {
                Acceleration: 1000,
                MaxSpeed: 1400,
                Shield: 700,
                ShieldRechargeRate: 250,
                Handeling: 0.045
            }
        }
    ];

    guiStats: IBikeStats = this.loaderList[0].Stats;

    @ViewChild("canvas") _canvas: ElementRef;

    animateSubscription: Subscription;

    @HostListener('document:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
        this.onKeyDown(event);
    }

    private _animationService: AnimationService = new AnimationService();

    constructor(
        private _lightService: LightService,
        private _loader: LoaderService,
        private _skyBoxService: SkyBoxService,
        private _player: PlayerService,
        private _router: Router
    ) {
        this.loader();
        for (let x of this.loaderList) {
            this.loaded[x.Name] = false;
        }

        this.animateSubscription = this._animationService.animation().subscribe((generalObject: IGeneralObject) => {
            this.general = generalObject;
            this.render();
        });

    }

    loader() {
        this.light = this._lightService.addSoftAmbientLight();

        this._skyBoxService.init("skySphere_5.jpg")
            .then((res: THREE.Object3D) => {
                res.name = "skyBox";
                this.skyBox = res;

                let promiseList = [];

                for (let x of this.loaderList) {
                    this.pointLightList.push(this._lightService.createSpotLight(0xddbfbf));
                    promiseList.push(this._loader.loadOBJ(x.Bike, x.Texture, x.Name))
                }

                Promise.all(promiseList)
                    .then((result: THREE.Object3D[]) => {
                        this.bikeList.push(...result);
                        this.setup();
                    });
            });
    }


    setup() {

        //camera and skybox
        this.camera.position.x = 500;
        this.camera.position.z = 500;
        this.camera.position.y = 175;

        this.skyBox.position.copy(this.camera.position);
        this.scene.add(this.skyBox);

        //bikes
        this.initBikes();

        //Lighting
        for (let x in this.bikeList) {
            this.pointLightList[x].position.copy(this.bikeList[x].position);
            this.pointLightList[x].position.y = 3000;
            this.pointLightList[x].lookAt(this.bikeList[x].position);
            this.scene.add(this.pointLightList[x]);
        }
        //renderer size

        this.renderer.setSize(1280, 720);
        //add and start

        this.trackingBike = this.bikeList[0].position;

        this._canvas.nativeElement.appendChild(this.renderer.domElement);
        this._animationService.startAnimation();
    }

    initBikes() {
        //bikes:
        this.bikeList[0].position.x = 1000;
        this.bikeList[0].position.z = -1000;

        this.bikeList[1].position.x = 1000;
        this.bikeList[1].position.z = 1000;

        this.bikeList[2].position.x = -1000;
        this.bikeList[2].position.z = 1000;

        this.bikeList[3].position.x = -1000;
        this.bikeList[3].position.z = -1000;

        //cilinders:

        const geometry = new THREE.CylinderGeometry(300, 300, 20, 128);
        const material = new THREE.MeshBasicMaterial({color: 0x4c4c4c});
        for (let x in this.bikeList) {
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.copy(this.bikeList[x].position);
            cylinder.position.y = -20;
            this.scene.add(cylinder);
            this.scene.add(this.bikeList[x]);
        }
    }

    nextBike(selectDirection: boolean) {
        if (selectDirection) {
            if (this.trackIndex < this.bikeList.length - 1) this.trackIndex++;
            else this.trackIndex = 0;
        } else {
            if (this.trackIndex > 0) this.trackIndex--;
            else this.trackIndex = this.bikeList.length - 1;
        }

        this.trackingBike = this.bikeList[this.trackIndex].position;
        this.guiStats = this.loaderList[this.trackIndex].Stats;
    }

    render() {
        this.t += 0.01;
        this.camera.position.x = 500 * Math.cos(this.t) + this.trackingBike.x;
        this.camera.position.z = 500 * Math.sin(this.t) + this.trackingBike.z;
        this.camera.lookAt(this.trackingBike);
        this.renderer.render(this.scene, this.camera);
    }

    startRace() {
        this._animationService.stopAnimation();
        this._player.setChosenBike(this.loaderList[this.trackIndex]);
        this._router.navigate(['/game']);
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key == 'a' || event.keyCode == 37) {
            this.nextBike(true);
        } else if (event.key == 'd' || event.keyCode == 39) {
            this.nextBike(false);
        } else if (event.keyCode == 13) {
            this.startRace();
        }
    }
}

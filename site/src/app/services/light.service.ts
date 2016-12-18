/// <reference path="../../../../typings/index.d.ts" />

import {Injectable} from "@angular/core";

@Injectable()
export class LightService {

    color: number = 0x404040;
    whiteColor: number = 0xddbfbf;
    softWhite: number = 0xddbfbf;

    constructor() {

    }

    public addAmbientLight(color :number) {
        return new THREE.AmbientLight(color, 1);
    }


    public addSoftAmbientLight() {
        return new THREE.AmbientLight(this.softWhite, 1);
    }

    public createSpotLight(color : number) {
        const newObj = new THREE.DirectionalLight( color, 0.8 );
        newObj.castShadow = true;
        return newObj;
    }

    public addPointLight() {
        return new THREE.DirectionalLight(this.color, 1)
    }
}
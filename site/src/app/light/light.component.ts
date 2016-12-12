import {Injectable} from "@angular/core";

@Injectable()
export class LightComponent {

    color: number = 0x404040;
    whiteColor: number = 0xddbfbf;

    constructor() {

    }

    public addAmbientLight() {
        return new THREE.AmbientLight(this.whiteColor, 1);
    }

    public addPointLight() {
        return new THREE.DirectionalLight(this.color, 1)
    }
}
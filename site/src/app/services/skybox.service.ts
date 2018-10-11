import * as THREE from 'three'
import {Injectable} from "@angular/core";

@Injectable()
export class SkyBoxService {

    Assets = "/assets/textures/";

    init(file) {

        if (!file) {
            file = "skySphere_5.jpg"
        }

        const skyGeo = new THREE.SphereGeometry(10000, 25, 25);

        const loader = new THREE.TextureLoader();

        return new Promise(
            (resolve, reject) => {
                loader.load(this.Assets + file, (texture) => {
                    const material = new THREE.MeshPhongMaterial({
                        map: texture,
                    });

                    material.side = THREE.BackSide;
                    const sky = new THREE.Mesh(skyGeo, material);
                    resolve(sky)
                },);
            })
    }
}

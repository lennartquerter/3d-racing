import * as THREE from 'three'
import {Injectable} from "@angular/core";

@Injectable()
export class SkyBoxService {

    init() {
        const skyGeo = new THREE.SphereGeometry(10000, 25, 25);

        const loader = new THREE.TextureLoader();
        return new Promise(
            (resolve, reject) => {
                console.log("start skybox");
                loader.load(
                    "../../assets/textures/skySphere_2.jpg",
                    (texture) => {
                        const material = new THREE.MeshPhongMaterial({
                            map: texture,
                        });

                        material.side = THREE.BackSide;
                        const sky = new THREE.Mesh(skyGeo, material);
                        resolve(sky)
                    }, (prog) => {
                        console.log("progress")
                    });
            })
    }
}

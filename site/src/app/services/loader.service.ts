import * as THREE from 'three'
import OBJLoader from 'three-obj-loader';

OBJLoader(THREE);

import {Injectable} from "@angular/core";

@Injectable()
export class LoaderService {
    Loader: OBJLoader = new THREE.OBJLoader();

    constructor() {

    }

    loadOBJ(path: string, textureFile: string, name: string) {

        if (!path) {
            console.log("could not get url to bike, using standard bike");
            path = "assets/objects/bike_2.obj";
        }

        if (!textureFile) {
            console.log("could not get texurefile, using standard tex");
            textureFile = "assets/textures/tron-01.jpg";
        }

        return new Promise((resolve, reject) => {
            this.Loader.load(path, (group) => {
                var textureLoader = new THREE.TextureLoader();

                textureLoader.load(textureFile, (texture) => {
                    const material = new THREE.MeshBasicMaterial({
                        map: texture,
                        reflectivity: 0.9,
                        blending: THREE.AdditiveBlending,
                        transparent: true
                    });

                    group.children.forEach((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.material = material;
                        }
                    });

                    return resolve(group);
                })
            });
        });
    }
}

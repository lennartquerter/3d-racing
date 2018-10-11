import * as THREE from 'three'
import OBJLoader from 'three-obj-loader';

OBJLoader(THREE);

import {Injectable} from "@angular/core";
import {group} from "@angular/animations";

@Injectable()
export class LoaderService {
    constructor() {

    }

    loadOBJ(path: string, textureFile: string, name: string) {

        if (!path) {
            console.log("could not get url to bike, using standard bike");
            path = "../../assets/objects/bike_2.obj";
        }

        if (!textureFile) {
            console.log("could not get texurefile, using standard tex");
            textureFile = "../../assets/textures/tron-01.jpg";
        }

        var loader = new THREE.OBJLoader();

        return new Promise((resolve, reject) => {
            loader.load(
                // resource URL
                path,
                // called when resource is loaded
                (group) => {
                    var textureLoader = new THREE.TextureLoader();

                    textureLoader.load(textureFile, (texture) => {
                        var material = new THREE.MeshBasicMaterial({map: texture});
                        return resolve(group);
                    })


                },
                // called when loading is in progresses
                function (xhr) {

                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');

                },
                // called when loading has errors
                function (error) {

                    console.log('An error happened');

                }
            );
        });
        //

        // const manager = new THREE.LoadingManager();
        // manager.onProgress = function (item, loaded, total) {
        //     console.log(item, loaded, total);
        // };
        // const loader = new THREE.OBJLoader(manager);
        // const texture = new THREE.TextureLoader().load(textureFile);
        // texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set(2, 2);
        //
        // return new Promise((resolve, reject) => {
        //     loader.load(path, (object: THREE.Object3D) => {
        //         object.traverse(function (child: any) {
        //             // if (child instanceof THREE.Mesh) {
        //             //     child.material.map = texture;
        //             // }
        //         });
        //         object.name = name;
        //         resolve(object);
        //     });
        // });
    }
}

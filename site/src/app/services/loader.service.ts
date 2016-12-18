/// <reference path="../../../../typings/index.d.ts" />

import {Injectable} from "@angular/core";

@Injectable()
export class LoaderService {
    constructor() {

    }

    loadOBJ(path : string, textureFile: string) {

        if (!path) {
            console.log("could not get url to bike, using standard bike");
            path = require("../../../assets/objects/bike_2.obj");
        }

        if (!textureFile) {
            console.log("could not get texurefile, using standard tex");
            textureFile = require("../../../assets/textures/tron-01.jpg");
        }
        const manager = new THREE.LoadingManager();
        manager.onProgress = function ( item, loaded, total ) {
            console.log( item, loaded, total );
        };
        const loader = new THREE.OBJLoader( manager );
        const texture = new THREE.TextureLoader().load(textureFile);
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 2, 2 );

        return new Promise((resolve, reject) => {
            loader.load(path, (object : THREE.Object3D) => {
                object.traverse( function ( child :any ) {
                    if ( child instanceof THREE.Mesh ) {
                        child.material.map = texture;
                    }
                });
                resolve(object);
            });
        });
    }
}
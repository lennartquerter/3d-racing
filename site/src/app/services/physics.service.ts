import {IGravityCheckReturn} from "../interface";
import {Injectable} from "@angular/core";

import * as THREE from 'three'
import * as moment from 'moment';
import {Object3D} from "three";

@Injectable()

export class PhysicsService {

    deathBB: THREE.Box3;
    level: THREE.Object3D;
    startLine: THREE.Mesh;
    startTime: moment.Moment;

    caster: THREE.Raycaster = new THREE.Raycaster();

    previousOutcome: number = 0;
    fallAcceleration: number = 7.8 * 100000000;
    lookForwardDistance: number = 512;

    rays: THREE.Vector3[] = [
        new THREE.Vector3(0, 0, 1),     //0 : forward,
        new THREE.Vector3(0, 0, -1),    //1 : backwards

        new THREE.Vector3(1, 0, 0),     //2 : left
        new THREE.Vector3(1, 0, 1),     //3 : forward left
        new THREE.Vector3(1, 0, -1),    //4 : backwards left

        new THREE.Vector3(-1, 0, 0),    //5 : right
        new THREE.Vector3(-1, 0, 1),    //6 : forwards right
        new THREE.Vector3(-1, 0, -1),   //7 : backwards right

        new THREE.Vector3(0, 1, 0),     //8 : above
        new THREE.Vector3(0, 1, 1),     //9 : above - forward
        new THREE.Vector3(0, 1, -1),    //10 : above - backward
        new THREE.Vector3(1, 1, 0),     //11 : above - left
        new THREE.Vector3(-1, 1, 0),    //12 : above - right

        new THREE.Vector3(0, -1, 0),    //13 : below
        new THREE.Vector3(0, -1, 1),    //14 : below - forward
        new THREE.Vector3(0, -1, -1),   //15 : below - backward
        new THREE.Vector3(-1, -1, 0),   //16 : below - right
        new THREE.Vector3(1, -1, 0),    //17 : below - left

        new THREE.Vector3(0, 0, 0)      //18 : none
    ];


    setupGravity(scene: THREE.Scene) {
        this.startTime = moment();

        this.level = scene.getObjectByName('model').children[0];

        this.deathBB = new THREE.Box3().setFromObject(scene.getObjectByName('death'));

        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const geometry = new THREE.BoxGeometry(2500, 2500, 1);

        this.startLine = new THREE.Mesh(geometry, material);
        this.startLine.position.z = 1250;
        scene.add(this.startLine);
    }

    GravityCheck(player: THREE.Object3D, camera: THREE.Camera): IGravityCheckReturn {
        const playerBB = new THREE.Box3().setFromObject(player);

        if (playerBB.min.y < this.deathBB.max.y) {
            return {d: true, g: 0, lt: 0}
        }

        const obj = this.checkForCollision(player);

        let distanceFromRoad = obj.distance;
        let falling = obj.falling;

        if (falling) {
            distanceFromRoad = -((this.fallAcceleration / Math.pow((player.position.y - this.deathBB.min.y), 2)).toFixed(2));
        }

        if (distanceFromRoad > 10 || distanceFromRoad < 0) {
            player.position.y += distanceFromRoad;
        }

        // change cam dir when going up or down
        if (this.previousOutcome - player.position.y > 2) {
            camera.rotateX(-0.01)
        } else if (this.previousOutcome - player.position.y < -2) {
            camera.rotateX(0.01)
        }

        return {d: false, g: 0, lt: 0}
    }

    checkForCollision(player: THREE.Object3D): any {
        let collisions: any;
        let i: number;

        let dist: number = 0;
        var falling = true;


        for (i = 0; i < this.rays.length; i += 1) {

            this.caster.set(player.position, this.rays[i]);

            collisions = this.caster.intersectObject(this.level);

            if (collisions.length > 0 && collisions[0].distance <= this.lookForwardDistance) {

                switch (i) {
                    // above
                    case 8:
                        dist = collisions[0].distance;
                        falling = false;
                        break;
                    // below
                    case 13:
                        dist = -collisions[0].distance;
                        falling = false;
                        break;
                    // front of player
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                    case 7:
                        dist += collisions[0].distance;
                        falling = false;
                        break;

                    case 9:
                    case 10:
                    case 11:
                    case 12:
                        break;

                    case 14:
                    case 15:
                    case 16:
                    case 17:
                        break;
                    default:
                        console.log("ray: " + i);
                        break;
                }
            }
        }
        return {
            distance: parseFloat(dist.toFixed(2)),
            falling: falling
        };
    }
}

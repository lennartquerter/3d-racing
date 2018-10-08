import {IGravityCheckReturn} from "../interface";
import {Injectable} from "@angular/core";

import * as THREE from 'three'
import * as moment from 'moment';

@Injectable()

export class PhysicsService {

    groundList: THREE.Box3[] = [];
    deathBB: THREE.Box3;
    level: THREE.Mesh;
    startLine: THREE.Mesh;
    startTime: moment.Moment;

    collidableMeshList: THREE.Mesh[] = [];

    rays: THREE.Vector3[] = [
        new THREE.Vector3(0, 0, 1),     //0: forward,
        new THREE.Vector3(0, 0, -1),    //1 : backwards

        new THREE.Vector3(1, 0, 0),     //2 : left
        new THREE.Vector3(1, 0, 1),     //3 : forward left
        new THREE.Vector3(1, 0, -1),    //4 : backwards left

        new THREE.Vector3(-1, 0, 0),    //5 : right
        new THREE.Vector3(-1, 0, 1),    //6 : forwards right
        new THREE.Vector3(-1, 0, -1),   //7 : backwards right

        new THREE.Vector3(0, 1, 0),     //8: above
        new THREE.Vector3(0, 1, 1),     //9 : above - forward
        new THREE.Vector3(0, 1, -1),    //10 : above - backward
        new THREE.Vector3(1, 1, 0),     //11 : above - left
        new THREE.Vector3(-1, 1, 0),    //12 : above - right

        new THREE.Vector3(0, -1, 0),    //13 : below
        new THREE.Vector3(0, -1, 1),    //14 : below - forward
        new THREE.Vector3(0, -1, -1),   //15 : below - backward
        new THREE.Vector3(-1, -1, 0),   //16 : below - right
        new THREE.Vector3(1, -1, 0),   //17 : below - left

        new THREE.Vector3(0, 0, 0)      //18 : none
    ];


    caster: THREE.Raycaster = new THREE.Raycaster();

    distanceAbove: number = 0;
    distanceBelow: number = 0;

    fallTime: number = 1;


    intersect: boolean = false;


    setupGravity(scene: THREE.Scene) {
        this.startTime = moment();
        for (let x in scene.children) {
            if (scene.children[x].name == 'model') {
                const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                // this.level = new THREE.Mesh(scene.children[x].children[0].geometry, material);
                this.level.position.y = 0;
                // scene.add(this.level);
                // console.log(this.level);
                this.collidableMeshList.push(this.level);

            }
            if (scene.children[x].name == 'death') {
                this.deathBB = new THREE.Box3().setFromObject(scene.children[x]);
            }
        }

        const geometry = new THREE.BoxGeometry(2500, 2500, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        this.startLine = new THREE.Mesh(geometry, material);
        this.startLine.position.z = 1250;
        // scene.add( this.startLine );
    }

    previousOutcome: number = 0;
    fallAcceleration: number = 7.8;

    GravityCheck(player: THREE.Object3D, camera: THREE.Camera): IGravityCheckReturn {
        const playerBB = new THREE.Box3().setFromObject(player);
        let death = (playerBB.min.y < this.deathBB.max.y);
        const laptime = this.checkForCollision(player);
        let outcome = 0;

        this.distanceAbove = parseFloat(this.distanceAbove.toFixed(2));
        this.distanceBelow = parseFloat(this.distanceBelow.toFixed(2));

        //check for distance between the road and object
        if (!this.intersect) {
            outcome -= ((this.fallAcceleration * 100000000) / Math.pow((player.position.y - this.deathBB.min.y), 2));
            console.log('!intersect');
        }

        // console.log(this.distanceBelow);

        if (this.distanceAbove > 2) {
            console.log('above:' + this.distanceAbove);
            outcome += this.distanceAbove;
            // } else if (this.distanceAbove > 3) {
            //     outcome += 2;
            // }
        }

        if (this.distanceBelow > 2) {
            outcome -= this.distanceBelow / 2;
        }
        //check for cheats
        if (player.position.y > 5000) {
            outcome = -15000;
        }

        //change cam dir when going up or down
        if (this.previousOutcome - player.position.y > 2) {
            camera.rotateX(-0.01)
        } else if (this.previousOutcome - player.position.y < -2) {
            camera.rotateX(0.01)
        }

        this.previousOutcome = player.position.y;
        //do not go up and down on small changes
        if (outcome < 1 && outcome > -1) {
            outcome = 0;
        }
        player.position.y += outcome;

        return {d: death, g: outcome, lt: laptime}
    }

    checkForCollision(player: THREE.Object3D) {
        const distance = 128;
        let collisions: any;
        let i: number;
        let startCollisions: any;

        this.intersect = false;

        for (i = 0; i < this.rays.length; i += 1) {
            this.caster.set(player.position, this.rays[i]);
            collisions = this.caster.intersectObjects(this.collidableMeshList);
            if (collisions.length > 0 && collisions[0].distance <= distance) {
                if (i == 8) {
                    this.intersect = true;
                    this.distanceAbove = collisions[0].distance;
                }
                if (i == 13) {
                    this.intersect = true;
                    this.distanceBelow = collisions[0].distance;
                }
            }
        }
        this.caster.set(player.position, this.rays[0]);
        startCollisions = this.caster.intersectObject(this.startLine);
        if (startCollisions.length > 0 && startCollisions[0].distance <= distance) {
            this.startTime = moment();

        }
        const afterLap = moment();
        return moment.utc(moment(afterLap, "DD/MM/YYYY HH:mm:ss").diff(moment(this.startTime, "DD/MM/YYYY HH:mm:ss"))).seconds();

    }
}

import {IGravityCheckReturn, IGravityObject} from "../interface";
import Vector3 = THREE.Vector3;
export class PhysicsService {

    groundList: THREE.Box3[] = [];
    deathBB: THREE.Box3;
    level: THREE.Mesh;
    startLine : THREE.Mesh;
    collidableMeshList: THREE.Mesh[] = [];

    rays: THREE.Vector3[];
    caster: THREE.Raycaster;
    count : number = 0;
    falltime : number = 0.4;


    setupGravity(scene: THREE.Scene) {
        for (let x in scene.children) {
            if (scene.children[x].name == 'model') {
                const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                this.level = new THREE.Mesh(scene.children[x].children[0].geometry, material);
                this.level.position.y = 0;
                // scene.add(this.level);
                this.collidableMeshList.push(this.level);

            }
            if (scene.children[x].name == 'death') {
                this.deathBB = new THREE.Box3().setFromObject(scene.children[x]);
            }
        }

        const geometry = new THREE.BoxGeometry( 2500, 2500, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.startLine = new THREE.Mesh( geometry, material );
        this.startLine.position.z = 1250;
        // scene.add( this.startLine );

    }

    GravityCheck(player: THREE.Object3D, frame : number): IGravityCheckReturn {

        let gravity: IGravityObject = {
            up: false,
            down: true,
        };

        this.caster = new THREE.Raycaster();
        this.rays = [
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

        this.collision(player);

        let outcome = 0;
        // console.log(this.distance);
        // console.log(this.belowDistance);

        this.distance = parseFloat(this.distance.toFixed(2));
        if (this.distance <= 1) {
            outcome -= this.distance;
        } else if  (this.distance > 1) {
            outcome += this.distance;
        }
        if (this.belowDistance <= 1) {
            outcome += this.belowDistance;
        } else if  (this.belowDistance > 1) {
            outcome -= this.belowDistance;
        }

        player.position.y += outcome;

        const playerBB = new THREE.Box3().setFromObject(player);
        let death = false;
        if (playerBB.min.y < this.deathBB.max.y) {
            death = true;
        }
        return {d: death, g: player.position.y}

    }

    distance : number = 0;
    belowDistance : number = 0;

    collision(player: THREE.Object3D) {
        let collisions, i, startCollisions,
            distance = 128;
        let up = false;
        let onlyeOne = true;
        for (i = 0; i < this.rays.length; i += 1) {
            this.caster.set(player.position, this.rays[i]);
            collisions = this.caster.intersectObject(this.level);
            if (collisions.length > 0 && collisions[0].distance <= distance) {
               if (i == 8 || i == 9 || i == 11 || i == 10 ||i == 12) {
                   up = true;
                   if (i == 11 || i == 10 ||i == 12) {
                       onlyeOne = false;
                   } else if (i == 8) {
                       this.distance = collisions[0].distance;
                   }
               }
                if (i == 13) {
                   this.belowDistance = collisions[0].distance;
               }
            }

            //check for lap completion
            startCollisions = this.caster.intersectObject(this.startLine);
            if (startCollisions.length > 0 && startCollisions[0].distance <= distance) {
                console.log("LAP +++")
            }
        }
    }
}
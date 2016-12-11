import {IGravityCheckReturn, IGravityObject} from "../interface";
export class PhysicsService {

    groundList: THREE.Box3[] = [];
    deathBB: THREE.Box3;
    gravity: number = 30;
    level: THREE.Mesh;
    collidableMeshList: THREE.Mesh[] = [];

    rays: THREE.Vector3[];
    caster: THREE.Raycaster;
    count : number = 0;
    falltime : number = 0.4;


    setupGravity(scene: THREE.Scene, gravity?: number) {
        this.gravity = gravity;
        let ground;
        let death;
        for (let x in scene.children) {
            if (scene.children[x].name == 'model') {
                const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
                this.level = new THREE.Mesh(scene.children[x].children[0].geometry, material);
                this.level.position.y = 0;
                // scene.add(this.level);
                this.collidableMeshList.push(this.level);

            }
            if (scene.children[x].name == 'death') {
                death = scene.children[x];
                this.deathBB = new THREE.Box3().setFromObject(death);
            }
            if (scene.children[x].name == 'ground') {
                console.log('added ground');
                ground = scene.children[x];
                this.groundList.push(new THREE.Box3().setFromObject(ground))
            }
        }
    }

    GravityCheck(player: THREE.Object3D): IGravityCheckReturn {

        let gravity :IGravityObject = {
            up : false,
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
            new THREE.Vector3(1, -1, 0) ,   //17 : below - left

            new THREE.Vector3(0, 0, 0)      //18 : none
        ];
        // Yep, this.rays[i] gives us :
        // 0 => forward,
        // 1 => forward-left,
        // 2 => left,
        // 3 => down-left
        // 4 => down
        // 5 => down-right
        // 6 => right
        // 7 => up-right
        // 8 => above
        // 9 => below
        // 10 => above forward
        // 11 => below forward

        gravity = this.collision(player, gravity);

        let outcome = 0;
        if (gravity.up) {
            outcome += this.distance;

            this.falltime = 0.4;
        }
        if (gravity.down && !gravity.up) {
            this.falltime += 0.004;
            outcome -= 20 * this.falltime;
        }

        player.position.y += outcome;

        const playerBB = new THREE.Box3().setFromObject(player);
        let death = false;

        // this.makeRect(playerBB);
        if (playerBB.min.y < this.deathBB.max.y) {
            death = true;
        }
        return {d: death, g: player.position.y}
    }

    distance : number;


    collision(player: THREE.Object3D, g : IGravityObject) {
        let collisions, i,
            distance = 64;
        let up = false;
        let onlyeOne = true;
        // console.log(this.level);
        for (i = 0; i < this.rays.length; i += 1) {
            this.caster.set(player.position, this.rays[i]);
            // Test if we intersect with any obstacle mesh
            collisions = this.caster.intersectObject(this.level);
            // And disable that direction if we do
            if (collisions.length > 0 && collisions[0].distance <= distance) {

               if (i == 8 || i == 9 || i == 11 || i == 10 ||i == 12) {
                   up = true;
                   if (i == 11 || i == 10 ||i == 12) {
                       onlyeOne = false;
                   } else {
                       if (i == 8) {
                           this.distance = collisions[0].distance;
                       }
                   }
                   // console.log(i);
               }
            }
        }
        return {
            up : !onlyeOne,
            down: true
        }
    }
}
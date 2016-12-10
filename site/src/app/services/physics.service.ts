export class PhysicsService {

    groundList : THREE.Box3[] = [];
    deathBB : THREE.Box3;
    gravity : number = 7.8;

    setupGravity(scene : THREE.Scene, gravity? : number) {
        this.gravity = gravity;
        let ground;
        let death;
        for (let x in scene.children) {
            console.log('checking');
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


    GravityCheck(player : THREE.Object3D) : boolean {
        const playerBB = new THREE.Box3().setFromObject(player);
        let death = false;
        let falling = false;
        console.log('playerx')
        console.log(playerBB.min.x);
        console.log('playerz')
        console.log(playerBB.min.z);

        // this.makeRect(playerBB);
        this.groundList.forEach((groundBB, idx) => {
            console.log(idx);
            console.log('groundminx:');
            console.log(groundBB.min.x);
            console.log('groundminz:');
            console.log(groundBB.min.z);
            console.log('groundmaxx:');
            console.log(groundBB.max.x);
            console.log('groundmaxz:');
            console.log(groundBB.max.z);

            // const rect = this.makeRect(groundBB);

            // console.log(rect);




            // if (playerBB.min.y > groundBB.max.y) {
            //     //todo, also when under the track , keep falling
            //     player.position.y -= this.gravity;
            // }
            // if (playerBB.min.x < groundBB.min.x) {
            //     player.position.y -= this.gravity;
            // }
            // if (playerBB.max.x > groundBB.max.x) {
            //     player.position.y -= this.gravity;
            // }
            if (playerBB.min.y < this.deathBB.max.y) {
                death = true;
            }
        });
        return death;
    }

    // makeRect(box : THREE.Box3) : THREE.Box3 {
    //     const rect = {
    //         a : [box.min.x, box.min.z],
    //         b : [box.max.x - box.min.x, box.min.z]
    //     }
    //
    //
    //
    // }
}
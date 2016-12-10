import {IKeyPress} from "../interface";
export class UpdateService {
    acceleration: number = 0;
    generalCarSpeedMultiplier: number =  1000;
    direction = {
        X: 0,
        Z: 0,
        Y : 0,
    };

    constructor() {

    }

    public init() {
    }

    public update(car :any, camera :any, keys: IKeyPress, dt :number) : number {
        const offsetY = car.rotation.y;
        const step = dt * this.generalCarSpeedMultiplier;
        this.direction = {
            X: 0,
            Z: 0,
            Y: 0,
        };

        if (this.acceleration > 0) {
            this.acceleration -= 0.0012;
        } else {
            this.acceleration += 0.0012;
        }

        if (keys.UP) {
            if (this.acceleration < 4) {
                if (this.acceleration < 0) {

                    car.rotateX(0.001);
                    this.acceleration += 0.03;
                } else {
                    this.acceleration += 0.02;
                }
            }
        }

        if (keys.DOWN) {
            if (this.acceleration > -1.4) {
                if (this.acceleration > 0) {
                    this.acceleration -= 0.03;
                } else {
                    this.acceleration -= 0.015;
                }
            }
        }
        const carPos = car.position;
        const carRot = car.rotation;
        const camPos = camera.position;

        const dx = carPos.x - camPos.x;
        const dz = carPos.z - camPos.z;

        console.log('x');
        console.log( carPos.x - camPos.x);
        console.log('z');
        console.log( carPos.z - camPos.z);


        if (keys.LEFT) {
            car.rotateY(0.01);
            if (dz < -800) {
                camera.position.z -= 7;
            }
            camera.position.x += 7;
        }

        if (keys.RIGHT) {
            car.rotateY(-0.01);
            if (dz < -800) {
                camera.position.z -= 7;
            }
            camera.position.x -= 7;

        }


        this.direction.Z = step * this.acceleration * Math.cos(car.rotation.y);
        this.direction.X = step * this.acceleration * Math.sin(car.rotation.y);



        // camera.position.x = car.position.x + 600 * Math.cos( this.acceleration * step );
        // camera.position.z = car.position.z + 600 * Math.sin( this.acceleration * step );
        camera.lookAt( car.position );



        /*
         moves the camera and the car in a 3D space.
         Z is forward
         X is left/right.
         The car rotates and gives the offsetY to the car.

         Rotate X - up/down
         Rotate Y - Left/Right
         Rotate Z = turn screen
         */

        car.position.z -= this.direction.Z;
        car.position.x -= this.direction.X;
        car.position.y -= this.direction.Y;

        camera.position.z -= this.direction.Z;
        camera.position.x -= this.direction.X;
        camera.position.y -= this.direction.Y;


        return this.acceleration;
    }


}
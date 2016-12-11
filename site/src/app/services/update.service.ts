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

    public reset() {
        this.acceleration = 0;
    }

    public update(car :any, camera :any, keys: IKeyPress, dt :number) : number {
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
                    car.rotateX(0.004);
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
        if (keys.LEFT) {
            car.rotateY(0.02);
        }

        if (keys.RIGHT) {
            car.rotateY(-0.02);
        }
        camera.quaternion.slerp(car.quaternion, 0.1);
        if (Math.cos(car.rotation.z) > -1) {
            this.direction.Z = step * this.acceleration * Math.cos(car.rotation.y);
        } else {
            this.direction.Z = step * this.acceleration * -Math.cos(car.rotation.y);
        }

        this.direction.X = step * this.acceleration * Math.sin(car.rotation.y);
        car.position.z -= this.direction.Z;
        car.position.x -= this.direction.X;
        car.position.y -= this.direction.Y;

        camera.position.z -= this.direction.Z;
        camera.position.x -= this.direction.X;
        camera.position.y -= this.direction.Y;

        camera.position.y = car.position.y + 200;

        return this.acceleration;
    }


}

/*
 moves the camera and the car in a 3D space.
 Z is forward
 X is left/right.
 The car rotates and gives the offsetY to the car.

 Rotate X - up/down
 Rotate Y - Left/Right
 Rotate Z = turn screen
 */
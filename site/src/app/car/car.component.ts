import {IKeyPress} from "../interface";
export class CarComponent {
    acceleration: number = 0;
    generalCarSpeedMultiplier: number =  1000;

    constructor() {

    }

    public init() {
    }
    
    public move(car :any, camera :any, keys: IKeyPress, dt :number) : number {
        const offsetY = car.rotation.y;
        const step = dt * this.generalCarSpeedMultiplier;

        if ((!keys.UP && !keys.DOWN)) {
            if (this.acceleration > 0.01) {
                this.acceleration -= 0.001 * step;
            } else if (this.acceleration < -0.01) {
                this.acceleration += 0.001 * step;
            }
        }

        if (keys.UP && this.acceleration < 4) {
            if (this.acceleration >= 0) {
                this.acceleration += 0.0005 * step;
            } else {
                this.acceleration += 0.002 * step;
            }
        }

        if (keys.DOWN && this.acceleration > -4) {
            //give gas going backward
            if (this.acceleration <= 0) {
                this.acceleration -= 0.0005 * step;
                //brake
            } else {
                this.acceleration -= 0.002 * step;
            }
        }

        if (keys.LEFT) {
            camera.rotateY(0.005);
            car.rotateY(0.01);
            camera.position.x += step * 0.2;
        }
        if (keys.RIGHT) {
            camera.rotateY(-0.005);
            car.rotateY(-0.01);
            camera.position.x -= step * 0.2;
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
        camera.position.z -= step * 2 * this.acceleration;
        car.position.z -= step * 2 * this.acceleration;
        car.position.x -= step * 2 * this.acceleration * (offsetY * 2);
        camera.position.x -= step * 2 * this.acceleration * (offsetY* 2);

        return this.acceleration;
}
}
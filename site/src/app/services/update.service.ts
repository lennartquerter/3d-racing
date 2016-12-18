import {IKeyPress, IGravityCheckReturn, IPlayerObject} from "../interface";
import {Injectable} from "@angular/core";

@Injectable()
export class UpdateService {
    acceleration: number = 0;

    accelerationLevels = {
        afterMaxSpeed : 0.0018,
        slowDown: 0.00125,
        level1 : 0.01,
        level2 : 0.015,
        level3 : 0.02,
        level4 : 0.025,
        level5 : 0.03,
    };



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

    public update(car :any, camera :any, currentPlayer: IPlayerObject, keys: IKeyPress, dt :number, drag: IGravityCheckReturn) {
        const step = dt * this.generalCarSpeedMultiplier;
        this.direction = {
            X: 0,
            Z: 0,
            Y: 0,
        };

        if (drag.g > 1) {
            currentPlayer.acceleration -= this.accelerationLevels.level3;
        } else if (drag.g < -1) {
            currentPlayer.acceleration += this.accelerationLevels.afterMaxSpeed;
        }

        if (currentPlayer.acceleration > 0) {
            currentPlayer.acceleration -= this.accelerationLevels.slowDown;
            if (car.rotation.x > 0.00) car.rotateX(-0.001);
        } else {
            currentPlayer.acceleration += this.accelerationLevels.slowDown;
        }

        if (keys.UP) {
            if (currentPlayer.acceleration < currentPlayer.speed.forward) {
                if (currentPlayer.acceleration < 0) {
                    currentPlayer.acceleration += this.accelerationLevels.level5;
                } else {
                    if (currentPlayer.acceleration < 7) {
                        currentPlayer.acceleration +=this.accelerationLevels.level2;
                    }
                    if (currentPlayer.acceleration < 4) {
                        currentPlayer.acceleration += this.accelerationLevels.level3
                    }
                }
            } else if (currentPlayer.acceleration < currentPlayer.speed.ultamateforward) {
                    currentPlayer.acceleration += this.accelerationLevels.afterMaxSpeed;
            }
        }
        if (keys.DOWN) {
            if (currentPlayer.acceleration > currentPlayer.speed.backwards) {
                if (currentPlayer.acceleration > 0) {
                    currentPlayer.acceleration -= this.accelerationLevels.level5
                } else {
                    currentPlayer.acceleration -= this.accelerationLevels.level2
                }
            }
        }

        if (keys.LEFT) {
            car.rotateY(0.02);
        }
        if (keys.RIGHT) {
            car.rotateY(-0.02);
        }

        if (parseInt(Math.cos(car.rotation.z).toFixed(0)) > -1) {
            this.direction.Z = step * currentPlayer.acceleration * Math.cos(car.rotation.y);
        } else {
            this.direction.Z = step * currentPlayer.acceleration * -Math.cos(car.rotation.y);
        }

        this.direction.X = step * currentPlayer.acceleration * Math.sin(car.rotation.y);

        car.position.z -= this.direction.Z;
        car.position.x -= this.direction.X;
        car.position.y -= this.direction.Y;

        camera.position.z -= this.direction.Z;
        camera.position.x -= this.direction.X;
        camera.position.y -= this.direction.Y;

        camera.quaternion.slerp(car.quaternion, 0.1);
        camera.position.y = car.position.y + 200;
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
import {Injectable} from "@angular/core";
import {IBike, IUser} from "../interface";
@Injectable()
export class PlayerService {
    bike : IBike;
    user : IUser = null;


    setChosenBike(b : IBike) {
        this.bike = b;
    }

    setUser(user : IUser) {
        this.user = user;
    }

    getBike() : IBike {

        if (this.bike) {
            return this.bike
        } else {
            return {
                Texture: require("../../../assets/textures/tron-01.jpg"),
                Bike :require("../../../assets/objects/bike_2.obj"),
                Name : 'bike-01',
                Stats : {
                    Acceleration : 700,
                    MaxSpeed : 1000,
                    Shield : 500,
                    ShieldRechargeRate : 100,
                    Handeling: 0.04
                }
            }
        }

    }
}
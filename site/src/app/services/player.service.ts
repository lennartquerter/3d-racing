import {Injectable} from "@angular/core";
@Injectable()
export class PlayerService {
    texture : string = require("../../../assets/textures/tron-01.jpg");
    bike : string = require("../../../assets/objects/bike_2.obj");
    name : string;


    setTexture(t : string) {
        this.texture = t
    }

    getTexture() {
        return this.texture
    }

    setBike(b : string) {
        this.bike = b
    }

    getBike() {
        return this.bike
    }

    setName(n : string) {
        this.name = n;
    }

    getName() {
        return this.name
    }

}
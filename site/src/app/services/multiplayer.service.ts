import {IPlayerObject} from "../interface";
import {LoaderService} from "./loader.service";
import {Inject} from "@angular/core";
import {Injectable} from "@angular/core";

@Injectable()
export class MultiplayerService {

    players : any = {};
    loadedPlayers : any = {};

    constructor(@Inject(LoaderService) private _loader: LoaderService) {

    }

    setLoaderObject(players : [IPlayerObject]) {
        for (let x in players) {
            this.loadedPlayers[players[x].name] = false;
        }
    }


    initializePlayers(scene : THREE.Scene, players : [IPlayerObject]) {
        return new Promise((resolve, reject) => {
            for (let x in players) {
                const player = require("../../../assets/objects/bike_2.obj");
                const playerText = require("../../../assets/textures/tron.png");
                this._loader.loadOBJ(player, playerText).then(
                    (res: THREE.Object3D) => {
                        this.players[players[x].name] = res;
                        scene.add(this.players[players[x].name]);
                        const bool = this.handleLoaded(players[x].name);
                        if (bool) {
                            resolve(bool);
                        }
                    }
                );
            }
        });
    }


    handleLoaded(name : string) {
        this.loadedPlayers[name] = true;
        let loaded = true;
        for (let x in this.loadedPlayers) {
            if (!this.loadedPlayers[x]) loaded = false;
        }

        if (loaded) {
            return true;
        }
    }

    updateOtherPlayers(players : [IPlayerObject]) {
        for (let x in players) {
            this.players[players[x].name].position.z = players[x].position.z;
            this.players[players[x].name].position.y = players[x].position.y;
            this.players[players[x].name].position.x = players[x].position.x;

            this.players[players[x].name].rotation.z = players[x].rotation.z;
            this.players[players[x].name].rotation.y = players[x].rotation.y;
            this.players[players[x].name].rotation.x = players[x].rotation.x;
        }
    }
}
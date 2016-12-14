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
            this.loadedPlayers[players[x].ID] = false;
        }
    }


    initializePlayers(scene : THREE.Scene, players : IPlayerObject[]) {
        console.log('init other players');
        console.log(players);
        return new Promise((resolve, reject) => {
            const promiseList = [];
            for (let x in players) {
                const player = players[x].bike;
                const playerText = players[x].bikeTexture;
                promiseList.push(this._loader.loadOBJ(player, playerText))
            }
            Promise.all(promiseList)
                .then(
                    (res: THREE.Object3D[]) => {
                        for (let x in players) {
                            this.players[players[x].ID] = res[x];

                            this.players[players[x].ID].position.z = players[x].position.z;
                            this.players[players[x].ID].position.y = players[x].position.y;
                            this.players[players[x].ID].position.x = players[x].position.x;

                            this.players[players[x].ID].rotation.z = players[x].rotation.z;
                            this.players[players[x].ID].rotation.y = players[x].rotation.y;
                            this.players[players[x].ID].rotation.x = players[x].rotation.x;

                            console.log(this.players[players[x].ID]);
                            scene.add(this.players[players[x].ID]);
                        }
                        resolve(true)
                    });

        });
    }

    startNewPlayer(scene : THREE.Scene, player: IPlayerObject) {
        const bike = player.bike;
        const playerText = player.bikeTexture;
        this._loader.loadOBJ(bike, playerText).then(
            (res: THREE.Object3D) => {
                this.players[player.ID] = res;
                console.log('added player');
                scene.add(res);
            }
        );
    }


    handleLoaded(ID : string) {
        this.loadedPlayers[ID] = true;
        let loaded = true;
        for (let x in this.loadedPlayers) {
            if (!this.loadedPlayers[x]) loaded = false;
        }

        if (loaded) {
            return true;
        }
    }

    deletePlayer(scene : THREE.Scene, id : string) {
        scene.remove(this.players[id]);
        delete this.players[id];
    }

    updateOtherPlayers(players : IPlayerObject[]) {
        if (players.length == 1) {
            return;
        }
        for (let x in players) {
            if (this.players[players[x].ID]) {
                this.players[players[x].ID].position.z = players[x].position.z;
                this.players[players[x].ID].position.y = players[x].position.y;
                this.players[players[x].ID].position.x = players[x].position.x;

                this.players[players[x].ID].rotation.z = players[x].rotation.z;
                this.players[players[x].ID].rotation.y = players[x].rotation.y;
                this.players[players[x].ID].rotation.x = players[x].rotation.x;
            }
        }
    }
}
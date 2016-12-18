import {IPlayerObject} from "../interface";
import {LoaderService} from "./loader.service";
import {Inject} from "@angular/core";
import {Injectable} from "@angular/core";
import {WebSocketService} from "./webSocket.service";

@Injectable()
export class MultiplayerService {

    players : any = {};
    loadedPlayers : any = {};
    _socketConnected = true;

    constructor(
        @Inject(LoaderService) private _loader: LoaderService,
        @Inject(WebSocketService) private _socketService : WebSocketService
    ) {

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


    public SendPlayerUpdate(player : THREE.Object3D, currentPlayer : IPlayerObject, connectedPlayerList : IPlayerObject[]) {
        if (this._socketConnected) {
            currentPlayer.position.x = player.position.x;
            currentPlayer.position.y = player.position.y;
            currentPlayer.position.z = player.position.z;
            currentPlayer.rotation.x = player.rotation.x;
            currentPlayer.rotation.y = player.rotation.y;
            currentPlayer.rotation.z = player.rotation.z;

            // console.log(currentPlayer.position);
            this._socketService.sendPlayerPosition(currentPlayer)
                .then((data: any) => {
                    connectedPlayerList = data;
                    this.updateOtherPlayers(data)
                })
                .catch((err: any) => {
                    this._socketConnected = false;
                })
        }
    }


    public RenderOtherPlayersPosition(step : number, players : IPlayerObject[]) {
        // for (let x in players) {
        //
        //
        //     if (this.players[players[x].ID]) {
        //         console.log(this.players[players[x].ID]);
        //         let direction = new THREE.Vector3();
        //         if (parseInt(Math.cos(this.players[x].rotation.z).toFixed(0)) > -1) {
        //             direction.z = step * this.players[x].acceleration * Math.cos(this.players[x].rotation.y);
        //         } else {
        //             direction.z = step * this.players[x].acceleration * -Math.cos(this.players[x].rotation.y);
        //         }
        //
        //         direction.x = step * this.players[x].acceleration * Math.sin(this.players[x].rotation.y);
        //
        //         this.players[x].position.z -= direction.z;
        //         this.players[x].position.x -= direction.x;
        //         this.players[x].position.y -= direction.y;
        //     }
        // }
    }
}
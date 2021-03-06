import {Observable} from 'rxjs';
import {Injectable} from "@angular/core";
import {IPlayerObject} from "../interface";
import * as io from "socket.io-client";



@Injectable()
export class WebSocketService {
    socket: any;

    constructor() {
        this.socket = io.connect('localhost:9900');

        this.socket.on('connect_error', function () {
            console.log('Connection failed');
        });
        this.socket.on('reconnect_failed', function () {
            console.log('Reconnection failed');
        });
    }


    sendPlayerPosition(position: IPlayerObject) {
        return new Promise((resolve, reject) => {
            this.socket.emit('playerPosition', position, (data: any) => {
                if (data.error) {
                    console.log((`Errored on send player position : ${data.error}`));
                    reject(`Errored on send player position : ${data.error}`)
                }
                resolve(data.playerList)
            })
        })
    }

    getPlayerPositions(): any {
        let observable = new Observable((observer: any) => {
            this.socket.on('positionUpdate', (player: IPlayerObject[]) => {
                observer.next(player);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    onDisconnect(): any {
        let observable = new Observable((observer: any) => {
            this.socket.on('disconnectedPlayer', (data: any) => {
                console.log('socket: disconnect');
                observer.next(data.ID);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    getNewPlayer(): any {
        let observable = new Observable((observer: any) => {
            this.socket.on('newPlayer', (player: any) => {
                observer.next(player.player);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    connectToGame(player: IPlayerObject, token: string): any {
        const data = {
            player: player,
            token: token
        };

        console.log(data);

        return new Promise((resolve, reject) => {
            return reject(data);

            // this.socket.emit('gameConnect', data, (data: any) => {
            //     resolve(data);
            // })
        })
    }
}

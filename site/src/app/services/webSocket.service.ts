import { Observable } from 'rxjs';
import {Injectable} from "@angular/core";
import {IPlayerObject} from "../interface";
import * as io from "socket.io-client";

@Injectable()
export class WebSocketService {
    socket : SocketIOClient.Socket;

    constructor() {

    }


    sendPlayerPosition(position : IPlayerObject) {
        this.socket.emit('playerPosition', position)
    }

    getMessages() {
        let observable = new Observable((observer : any) => {
            this.socket = io.connect();
            this.socket.on('playerPosition', (player: IPlayerObject) => {
                observer.next(player);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}
import {IKeyPress} from "../interface";
import {Injectable} from "@angular/core";

@Injectable()
export class KeyService {

    keys : IKeyPress = {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false
    };

    mouseDown : boolean = false;

    onKeyPress(event: any, keyDown: boolean) : IKeyPress {
        if (event.key == 'w' || event.keyCode == 38) {
            this.keys.UP = keyDown;
        } else if (event.key == 's' || event.keyCode == 40) {
            this.keys.DOWN = keyDown;
        } else if (event.key == 'a' || event.keyCode == 37) {
            this.keys.LEFT = keyDown;
        } else if (event.key == 'd' || event.keyCode == 39) {
            this.keys.RIGHT = keyDown;
        }

        return this.keys
    }

    onClickEvent(event : any, mousedown : boolean) : IKeyPress {
        this.keys.UP = mousedown;
        this.mouseDown = mousedown;
        return this.keys;
    }


    onMouseMovement(event : any) : IKeyPress {
        //op mobile zou dit gewoon de camera moeten zijn denk ik ....
        //misschien ook op desktop
        // console.log(event.srcElement.clientWidth);
        // if (event.offsetX > 880) {
        //     this.keys.RIGHT = true;
        // } else if (event.offsetX < 400) {
        //     this.keys.LEFT = true;
        // } else {
        //     this.keys.LEFT = false;
        //     this.keys.RIGHT = false;
        // }
        return this.keys
    }
}
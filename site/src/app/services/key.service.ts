import {IKeyPress} from "../interface";
export class KeyService {

    keys : IKeyPress = {
        UP: false,
        DOWN: false,
        LEFT: false,
        RIGHT: false
    };

    onKeyPress(event: any, keyDown: boolean) {
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

}
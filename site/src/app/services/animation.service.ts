
import {Injectable} from "@angular/core";
import {Observable, Observer} from "rxjs";

@Injectable()
export class AnimationService {
    running: boolean = false;

    general = {
        dt: 0,
        last: 0,
        frame: 0,
        fps : 0
    };

    private lastCalledTime : any;

    constructor() {
        console.log('Animation service is created');
    }

    animation(): any {
        return new Observable((observer: any) => {
            this.animate(observer);
        });
    }

    then = Date.now();
    fpsInterval = 1000 / 30;

    animate(observer : any) {
        const now = Date.now();
        this.general.dt = Math.min(1, (now - this.general.last) / 1000);
        this.general.last = now;
        this.general.frame++;
        if (this.general.frame > 24) {
            this.general.frame = 0;
        }
        let elapsed = now - this.then;

        requestAnimationFrame(() => this.animate(observer));

        if (elapsed > this.fpsInterval) {
            this.then = now - (elapsed % this.fpsInterval);

            if(!this.lastCalledTime) {
                this.lastCalledTime = Date.now();
                this.general.fps = 0;
            }
            const delta = (Date.now() - this.lastCalledTime)/1000;
            this.lastCalledTime = Date.now();
            this.general.fps = 1/delta;


            if (this.running) {
                observer.next(this.general);
            }

        }
    }

    stopAnimation() {
        this.running = false;
    }

    startAnimation() {
        this.running = true;

    }

}
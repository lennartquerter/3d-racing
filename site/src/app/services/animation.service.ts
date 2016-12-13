
import {Injectable} from "@angular/core";
import {Observable, Observer} from "rxjs";

@Injectable()
export class AnimationService {
    running: boolean = false;

    general = {
        dt: 0,
        last: 0,
        frame: 0
    };

    animation(): any {
        return new Observable((observer: any) => {
            this.animate(observer);
        });
    }

    animate(observer : any) {
        const now = new Date().getTime();
        this.general.dt = Math.min(1, (now - this.general.last) / 1000);
        this.general.last = now;
        this.general.frame++;
        if (this.general.frame > 24) {
            this.general.frame = 0;
        }
        if (this.running) {
            observer.next(this.general);
        }

        requestAnimationFrame(() => this.animate(observer));
    }

    stopAnimation() {
        this.running = false;
    }

    startAnimation() {
        this.running = true;

    }

}
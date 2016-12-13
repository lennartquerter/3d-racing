import {Component} from '@angular/core';
import {PlayerService} from "../services/player.service";
import {Router} from "@angular/router";
@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
})
export class HomeComponent {
    name : string = '';

    constructor(
        private _player : PlayerService,
        private _router : Router
    ) {}

    selectBike() {
        this._player.setName(this.name);
        this._router.navigate(['/player']);
    }
}
import {Component} from '@angular/core';
import {PlayerService} from "../services/player.service";
import {Router} from "@angular/router";
import {IHomePageModel} from "../interface";
import {ApiService} from "../services/api.service";
@Component({
    selector: 'home',
    templateUrl: 'home.component.html',
})
export class HomeComponent {
    model : IHomePageModel = {
        name : '',
        password : '',
        passwordCheck: '',
        email : '',
    };

    errorMessage: any = '';

    constructor(
        private _player : PlayerService,
        private _router : Router,
        private _apiService : ApiService

    ) {}

    selectBike() {
        this._player.setName(this.model.name);
        this._router.navigate(['/player']);
    }


    login() {
        const loginRequest = btoa(this.model.name + "::" + this.model.password);
        console.log(loginRequest);

            this._apiService.request('login', loginRequest)
                .subscribe(
                    res => {
                        console.log(res);
                    },
                    err =>  {
                        console.log(err);
                        this.errorMessage = <any>err;
                    });

    }


    register() {
        this._apiService.request('register', this.model)
            .subscribe(
                res => {
                    console.log(res);
                },
                err =>  {
                    console.log(err);
                    this.errorMessage = <any>err;
                });

    }
}
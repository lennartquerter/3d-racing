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
        showLoginError : false,
        showLoginLoading  : true,
        errorMessage: '',
        loginError: '',
    };



    constructor(
        private _player : PlayerService,
        private _router : Router,
        private _apiService : ApiService

    ) {}


    login() {
        this.model.showLoginError = false;
        this.model.showLoginLoading = true;
        const loginRequest = btoa(this.model.name + "::" + this.model.password);
            this._apiService.request('login', loginRequest)
                .subscribe(
                    res => {
                        this.model.showLoginLoading = false;
                        console.log(res);
                        if (res.status == 403) {
                            this.model.showLoginError = true;
                            this.model.loginError = "Password did not match";
                            console.log("Unauth");
                        } else if (res.status == 404) {
                            this.model.showLoginError = true;
                            this.model.loginError = "User not found";
                            console.log("user not found");
                        } else if (res.status == 200) {
                            console.log("continue");
                            this._apiService.setHeaders(res.data);
                            this._player.setUser(res.data.user);
                            this._router.navigate(['/player'])
                        } else {
                            this.model.showLoginError = true;
                            this.model.loginError = "Something went wrong server side";
                        }
                    },
                    err =>  {
                        console.log(err);
                        this.model.showLoginLoading = false;
                        this.model.showLoginError = true;
                        this.model.loginError = "Something went wrong server side";
                        this.model.errorMessage = <any>err;
                    });
    }


    register() {
        console.log(this.model);
        if (this.model.password != this.model.passwordCheck) {
            console.log("Passwords do not match");
            return;
        }
        const registerRequest = btoa(this.model.name + "::" + this.model.password + "::" + this.model.email);
        this._apiService.request('register', registerRequest)
            .subscribe(
                res => {
                    console.log(res);
                    if (res.status == 201) {
                        this.login();
                    }
                },
                err =>  {
                    console.log(err);
                    this.model.errorMessage = <any>err;
                });
    }
}
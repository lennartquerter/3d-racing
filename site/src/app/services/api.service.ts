import {Injectable, Inject} from "@angular/core";
import {Http, Response, Headers} from "@angular/http";
import {Observable} from "rxjs";

import { IUser } from '../interface';

@Injectable()
export class ApiService {

    apiUrl : string = '/api/';
    headers : Headers = new Headers();
    token : string = null;

    constructor(@Inject(Http) private _http : Http) {

    }


    public setHeaders(data : any) {
        this.headers.append("API_TOKEN", data.token.toString());
        this.token = data.token.toString();
    }

    public request(route : string, data : any) : Observable<any> {
        console.log(route);
        console.log(data);
        return this._http.post(this.apiUrl + route, {data : data})
            .map(this.extractData)
            .catch(this.handleError)
    }


    private extractData(res: Response) {
        let body = res.json();
        return {data: body.data, status: body.status}
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    public getToken() {
        return this.token || "���j�vk]8Z���}\Z��ãB�V;!>��#H�T�ZC��	����";
    }


}
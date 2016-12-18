/// <reference path="../../typings/index.d.ts" />

import * as mongoose from 'mongoose';

export interface IUser extends mongoose.Document{
    CreatedAt: string,
    UpdatedAt: string
    UserName: string,
    Password: string,
    Email : string,
    Won : string,
    Lost : string,
    Badges : string
}

export interface ISessionToken {
    token : string
    userName : string
    created : string
    role : string
}


export interface IPlayerObject {
    ID : string
    position: IVector3
    rotation: IVector3
    name: string
    bike: string
    bikeTexture: string
}


export interface IVector3 {
    x: number
    y: number
    z: number
}
/// <reference path="../typings/index.d.ts" />

import * as mongoose from 'mongoose';


export interface IGameStats extends mongoose.Document{
    Won : number,
    Played : number,
    badges : [string]
}

export interface IItemStatList extends mongoose.Document{
    Speed: number,
    Acceleration: number,
    ShieldProtection : number,
    ShieldRechargeRate : number,
    GunDamage : number,
    FireRate : number
}

export interface IUnlockedItem extends mongoose.Document{
    Name : string,
    Stats : IItemStatList
    FilePath : string,
    Description : string,

}

export interface IUnlockables extends mongoose.Document{
    Bikes : IUnlockedItem[],
    Textures : IUnlockedItem[],
    Guns : IUnlockedItem[]
}

export interface IUser extends mongoose.Document{
    CreatedAt : string
    UpdatedAt : string,
    UserName: string,
    Password: string,
    Email: string,
    GameStats: IGameStats,
    Unlockables : IUnlockables
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
    token: string
}


export interface IVector3 {
    x: number
    y: number
    z: number
}
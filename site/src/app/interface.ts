
import {isBoolean} from "util";
export interface IKeyPress {
    UP: boolean,
    DOWN: boolean,
    LEFT: boolean,
    RIGHT: boolean
}

export interface ISkyBoxMapping {
    posx: string
    posy: string
    posz: string
    negx: string
    negy: string
    negz: string
}

export interface IGravityCheckReturn {
    g : number
    d : boolean
    lt : number
}

export interface IGravityObject {
    up: boolean
    down : boolean

}

export interface IPlayerObject {
    ID : string
    position : IVector
    rotation : IVector
    name : string
    bike : string
    bikeTexture : string
}

export interface IVector {
    x: number
    y: number
    z: number
}

export interface IGeneralObject {
    dt: number
    last: number
    frame: number
}
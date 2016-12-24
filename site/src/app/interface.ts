
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
    acceleration : number
    name : string
    bike : IBike
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

export interface ISpeedObject {
    forward : number
    ultamateforward : number,
    backwards : number,
    handeling : number
}


export interface IHomePageModel {
    name: string
    password: string
    passwordCheck: string
    email: string
    showLoginError : boolean,
    showLoginLoading  : boolean,
    errorMessage: any,
    loginError: string,
}

export interface IGameStats {
    Won : number,
    Played : number,
    badges : [string]
}

export interface IItemStatList {
    Speed: number,
    Acceleration: number,
    ShieldProtection : number,
    ShieldRechargeRate : number,
    GunDamage : number,
    FireRate : number
}

export interface IUnlockedItem {
    Name : string,
    Stats : IItemStatList
    FilePath : string,
    Description : string,

}

export interface IUnlockables {
    Bikes : IUnlockedItem[],
    Textures : IUnlockedItem[],
    Guns : IUnlockedItem[]
}

export interface IUser {
    CreatedAt : string
    UpdatedAt : string,
    UserName: string,
    Password: string,
    Email: string,
    GameStats: IGameStats,
    Unlockables : IUnlockables
}

export interface IBikeStats {
    Acceleration : number
    MaxSpeed : number
    Shield : number
    ShieldRechargeRate : number,
    Handeling : number
}

export interface IBike {
    Texture: string
    Bike : string
    Name : string
    Stats : IBikeStats
}
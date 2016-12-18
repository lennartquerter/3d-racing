/// <reference path="../../../../typings/index.d.ts" />

import express = require("express");
import * as mongoose from 'mongoose';
import {
    IUser
} from "../../interface.server";

export const UserSchema = new mongoose.Schema({
    CreatedAt : {type : String, 'default' : Date.now},
    UpdatedAt : {type : String, 'default' : Date.now},
    UserName: {type : String, required : true},
    Password: {type : String, required : true},
    Email: {type : String, required : true},
    Won : {type : String, required : true},
    Lost : {type : String, required : true},
    badges : {type : String, required : true}
});


export const User = mongoose.model<IUser>('User', UserSchema);


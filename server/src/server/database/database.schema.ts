/// <reference path="../../../typings/index.d.ts" />

import express = require("express");
import * as mongoose from 'mongoose';

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

import {
    IUser, IGameStats, IItemStatList, IUnlockedItem, IUnlockables
} from "../../interface.server";

export const GameStatsSchema = new mongoose.Schema({
    Won : {type : Number, required : true},
    Played : {type : Number, required : true},
    badges : {type : [String], required : false}
});

export const ItemStatListSchema = new mongoose.Schema({
    Speed: {type : Number, required : true},
    Acceleration: {type : Number, required : true},
    ShieldProtection : {type : Number, required : true},
    ShieldRechargeRate : {type : Number, required : true},
    GunDamage : {type : Number, required : true},
    FireRate : {type : Number, required : true}
});

export const UnlockedItemSchema = new mongoose.Schema({
    Name : {type : String, required : true},
    Stats : {type : ItemStatListSchema, required : true},
    FilePath : {type : String, required : true},
    Description : {type : String, required : true},

});

export const UnlockablesSchema = new mongoose.Schema({
    Bikes : {type : [UnlockedItemSchema], required : false},
    Textures : {type : [UnlockedItemSchema], required : false},
    Guns : {type : [UnlockedItemSchema], required : false}
});

export const UserSchema = new mongoose.Schema({
    CreatedAt : {type : String, 'default' : Date.now},
    UpdatedAt : {type : String, 'default' : Date.now},
    UserName: {type : String, required : true, index: { unique: true } },
    Password: {type : String, required : true},
    Email: {type : String, required : true},
    GameStats: {type: GameStatsSchema, required: true},
    Unlockables : {type: UnlockablesSchema, required: true}
});

UserSchema.pre('save', function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('Password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.Password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.Password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.Password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

export const GameStats = mongoose.model<IGameStats>('GameStats', GameStatsSchema);
export const ItemStatList = mongoose.model<IItemStatList>('ItemStatList', ItemStatListSchema);
export const UnlockedItem = mongoose.model<IUnlockedItem>('UnlockedItem', UnlockedItemSchema);
export const Unlockables = mongoose.model<IUnlockables>('Unlockables', UnlockablesSchema);
export const User = mongoose.model<IUser>('User', UserSchema);
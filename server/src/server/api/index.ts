/// <reference path="../../../typings/index.d.ts" />

import express = require("express");
import mongoose = require("mongoose");

import { User, GameStats, Unlockables } from '../database/database.schema';

export class ApiComponent {
    constructor() {

    }

    request = (req: any, res: express.Response, type: string) => {
        if (type == 'login') {
            this.login(req, res);
        } else if (type == 'register') {
            this.register(req,res);
        }
    };

    login (data: any, res: express.Response) {
        const userCred = new Buffer(data, 'base64').toString().split('::');

        User.findOne({UserName : userCred[0]}, function (err, user) {
            if (err) {
                console.log('user ' + userCred[0] + ' not found or error:' + err);
                res.send({status: 404, data: "Not found"})
            }
            if (!user) {
                console.log('user ' + userCred[0] + ' not found');
                res.send({status: 404, data: "Not found"});
                return;
            }
            user.comparePassword(userCred[1], function(err, isMatch) {
                if (err) {
                    console.log('user ' + userCred[0] + ' not password compare error:' + err);
                    res.send({status: 500, data: "password error"})
                }
                if (isMatch) {
                    const token = new Buffer(user.UserName + "::" + user.Password, 'base64').toString();
                    delete user.Password;
                    res.send({status: 200, data: {user : user, token : token}})
                    return;
                } else {
                    res.send({status: 403, data: "Password does not match"});
                }

            });
        });
    }


    register (data: any, res: express.Response) {
        console.log(data);
        const userRegister = new Buffer(data, 'base64').toString().split('::');
        console.log(userRegister);
        
        const unlockables = new Unlockables({
            Bikes : [],
            Textures : [],
            Guns : [],
        });
        
        const gameStats = new GameStats({
            Won : 0,
            Played : 0,
            Badges : []
        });

        const user = new User({
            UserName: userRegister[0],
            Password: userRegister[1],
            Email: userRegister[2],
            GameStats: gameStats,
            Unlockables : unlockables
        });
        
        user.save(function (err, user) {
            if (err) {
                console.log('Could not save player: ' + err);
                res.send({status: 500, data: "Not Saved"})
            }

            console.log("Saved: ");
            console.dir(user);
            res.send({status: 201, data: "Saved"})
        })
    }
}
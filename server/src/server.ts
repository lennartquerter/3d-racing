/// <reference path="../../typings/index.d.ts" />
import * as bodyParser from "body-parser";
import * as mongoose from 'mongoose';
import * as express from "express";

import * as http from 'http';
import * as io from "socket.io"

import {RoutesComponent} from "./server/routes/index";
import {ApiComponent} from "./server/api/index";
import {IPlayerObject} from "./interface.server";

const app = express();


http.Server(app);
io(http);

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('../site/dist'));

//database
mongoose.connect('localhost:27017/game');

const db = mongoose.connection;

db.on('error', function (err) {
    console.log('Database gave an error.');
    console.log(err);
});
db.once('open', function() {
    console.log('The server is connected to a Mongo DataBase.')
});




const playerList : IPlayerObject[] = [];



io.on('connection', socket => {
    console.log('a user connected: ' + socket.id);

    socket.on('gameConnect', (player, fn) => {
        console.log('Game connected: ' + socket.id);

        //adding player to server player list
        player.ID = socket.id;
        socket.broadcast.emit('newPlayer', {player: player});
        //send back the playerlist without the added player
        fn({ID : socket.id, playerList : playerList});
        playerList.push(player);
        console.log('player added ' + playerList.length);
    });

    socket.on('playerPosition', (player, fn) => {
        //update playerlist and send back other players
        if (!player.ID) {
            fn({error : "Player has no ID"})
        }
        for (let x in playerList) {
            if (playerList[x].ID == player.ID) {
                playerList[x].position.x = player.position.x;
                playerList[x].position.z = player.position.z;
                playerList[x].position.y = player.position.y;
                playerList[x].rotation.x = player.rotation.x;
                playerList[x].rotation.z = player.rotation.z;
                playerList[x].rotation.y = player.rotation.y;

                fn({playerList : playerList});
                return;
            }
        }
    });

    socket.on('disconnect', () => {
        //delete the player from the list
        io.sockets.emit('disconnectedPlayer',{ID : socket.id});
        for (let x in playerList) {
            if (playerList[x].ID == socket.id) {
                playerList.splice(parseInt(x), 1);
                console.log('player Disconnected: ' + socket.id);
            }
        }
    })
});

const Routes = new RoutesComponent();
const Api = new ApiComponent();

// Routes

app.get('/', Routes.home);

//product functions

app.post('/api/:type', Api.request);


//app serve

http.listen(9900, function () {
    console.log('Extreme G Racing on port 9900')
});
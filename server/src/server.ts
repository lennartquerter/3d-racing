/// <reference path="../typings/index.d.ts" />

//****************
//imports
//****************

import * as bodyParser                      from "body-parser";
import * as mongoose                        from 'mongoose';
import * as express                         from "express";

import {RoutesComponent}                    from "./server/routes/index";
import {ApiComponent}                       from "./server/api/index";

import {Sockets}                            from "./server/socket/index";
import {IPlayerObject}                      from "./interface.server";

//****************
//Setup
//****************

const app = express();

const server = require('http').Server(app);
const sio = require('socket.io')(server);

//****************
//middleware
//****************

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.static('../../site/dist'));

//****************
//Database
//****************

mongoose.connect('localhost:27017/game');

const db = mongoose.connection;

db.on('error', (err : any) => {
    console.log('Database gave an error.');
    console.log(err);
});

db.once('open', () => {
    console.log('The server is connected to a Mongo DataBase.')
});

//****************
//Server
//****************

const s = new Sockets();
let playerList : IPlayerObject[] = [];

sio.on('connection', socket => {
    socket.on('gameConnect', (player, fn) => {
        playerList = s.gameConnect(player, fn, socket, playerList)
    });
    socket.on('playerPosition', (player, fn) => {
        playerList = s.playerPosition(player, fn, socket, playerList)
    });
    socket.on('disconnect', (player, fn) => {
        console.log('disconnect');
        playerList = s.disconnect(player, fn, socket, playerList)
    });

});

//*************
//routing & api:
//*************

let Routes = new RoutesComponent();
let Api = new ApiComponent();

//Routing
//Home Page

app.get('/', Routes.home);

//API
app.post('/api/:type', (req: express.Request, res: express.Response) => {
    const type = req.params.type;
    const data : any = req.body.data;
    Api.request(data, res, type)
});


//*************
//Serving
//*************

server.listen(9900, function () {
    console.log('Extreme G Racing on port 9900')
});
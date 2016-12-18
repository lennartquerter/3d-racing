const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('../site/dist'));


app.get('/', function (req, res) {
    res.sendFile('index.html', {root: '../site/dist/'})
});


app.post('/api/login', function (req, res) {
    console.log(req)
});

const playerList = [];

//as struct
const playerObject = {
    ID : '',
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    name: '',
    bike: '',
    bikeTexture: ''
};

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

http.listen(9900, function () {
    console.log('Extreme G Racing on port 9900')
});
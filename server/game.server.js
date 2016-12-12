const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('../site/dist'));


app.get('/', function (req, res) {
    res.sendFile('index.html', {root: '../site/dist/'})
});

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on('playerPosition', function(msg){
        socket.broadcast.emit('playerPosition', msg);
    });
});

http.listen(9900, function () {
    console.log('Extreme G Racing on port 9900')
});
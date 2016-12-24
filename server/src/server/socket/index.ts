export class Sockets {
    constructor() {

    }

    gameConnect(data, fn, socket, playerList) {
        console.log("gameConnect");
        // console.dir(data);
        if (!data.token) {
            console.log("no token");
            fn({data: "NO TOKEN", status: 403});
            return;
        }

        for (let x in playerList) {
            if (playerList[x].token == data.token) {
                console.log('player already connected, deleting player..');
                playerList.splice(parseInt(x), 1);
                console.log('player Disconnected');
            }
        }

        const player = data.player;
        //adding player to server player list
        player.ID = socket.id;
        player.Token = data.token;
        socket.broadcast.emit('newPlayer', {player: player});

        //send back the playerList without the added player
        fn({ID: socket.id, playerList: playerList});
        playerList.push(player);
        console.log('player added ' + playerList.length);
        return playerList;
    }


    playerPosition(player, fn, socket, playerList) {
        if (!player.ID) {
            fn({error: "Player has no ID"})
        }
        for (let x in playerList) {
            if (playerList[x].ID == player.ID) {
                playerList[x].position.x = player.position.x;
                playerList[x].position.z = player.position.z;
                playerList[x].position.y = player.position.y;
                playerList[x].rotation.x = player.rotation.x;
                playerList[x].rotation.z = player.rotation.z;
                playerList[x].rotation.y = player.rotation.y;

                fn({playerList: playerList});
            }
        }
        return playerList;
    }

    disconnect(player, fn, socket, playerList) {
        if (playerList) {
            console.log(playerList.length);
            for (let x in playerList) {
                if (playerList[x].ID == socket.id) {
                    playerList.splice(parseInt(x), 1);
                    console.log('player Disconnected: ' + socket.id);
                }
            }
            return playerList;
        } else {
            return [];
        }
    }
}


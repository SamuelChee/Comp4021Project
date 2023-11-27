const Socket = (function() {
    // This stores the current Socket.IO socket
    let socket = null;

    // This function gets the socket from the module
    const getSocket = function() {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function() {
        socket = io();
        // Wait for the socket to connect successfully
        socket.on(SocketEvents.CONNECT, () => {
        });
        socket.on(SocketEvents.CONNECT_ERROR, (err) => {
            console.log(`Connect error due to ${err.message}`);
        });

        // Acknowledgement from server that user joined queue, if they couldn't join a game.
         socket.on(SocketEvents.JOINED_QUEUE, (queue_position) => {
            // TODO: change UI to show that user has been queued up. Change the queue up button to leave queue button.
            // TODO: maybe add a mechanism to stop someone from spamming the queue button.

        });

        // Acknowledgement from server that user left queue.
         socket.on(SocketEvents.LEFT_QUEUE, () => {
            // TODO: change UI to show that user has left the queue. Change the leave queue button to join queue button.
            // TODO: maybe add a mechanism to stop someone from spamming the queue button.

        });

        // Acknowledgement from server telling that user has joined a game.
        //  socket.on(SocketEvents.LOAD_LEVEL, (init) => {
            /*
            init contains the following
            JSON.stringify({
            gameID, 
            usernames, 
            map: map.getMapInfo(),
            playerInfos,
            playerStates}))

            see GameManager.js
            */
            // init = JSON.parse(init);
            // console.log(init);
            // console.log(init.map.platforms);
            // TODO: Implement how the client will load the level like drawing sprites etc.
            // the function should probably take the opponent's information and map as a parameter


            // When the client is done loading the level, send an acknowledgement event to 
            // the server that they're ready.
        // });
        

        // Acknowledgement from server telling the user has left a game/match.
         socket.on(SocketEvents.LEFT_GAME, () => {
            // TODO: handle user leaving the game, like going back to the lobby page or something

        })
        
        // Tells the client that the other player in the game has left.
        // see disconnectPlayer function in GameManager
         socket.on(SocketEvents.PLAYER_LEFT, (playerInfo) => {
            // TODO: handle other player in game leaving.

        })

        // Tells the client that the game has started
        socket.on(SocketEvents.START_GAME_LOOP, () => {
            // TODO: handle start could be some sort of countdown or not.
            // If a countdown were to be used maybe disable key inputs during the countdown

        })

        // Handles update calls from the server
         socket.on(SocketEvents.UPDATE, (updateObject) => {
            // TODO: update object could be anything like player state, projectiles, etc.
            updateObject = JSON.parse(updateObject);
        })

        // Handles game over calls
         socket.on(SocketEvents.GAMEOVER, (statistics) => {
            // TODO: display gameover screen.

            // Statistics contain statistics about both players, and whether they are the winner

            // statistics, key: usernames, value: playerState (health, ammo, etc.), 
            // Statistics (kills, shots_fired, etc.), winner (true if corresponding user is winner)
            statistics = JSON.parse(statistics);
        })
    };

    // This function disconnects the socket from the server
    const disconnect = function() {
        socket.disconnect();
        socket = null;
    };

    // join queue
    const joinQueue = function(){
        console.log("joining queue");
        socket.emit(SocketEvents.JOIN_QUEUE);
    }

    // leave queue
    const leaveQueue = function(){
        console.log("leaving queue");
        socket.emit(SocketEvents.LEAVE_QUEUE);
    }

    // Call this when the level is done loading, maybe call this via a promise.
    const ready = function(){
        console.log("Done loading")
        socket.emit(SocketEvents.READY);
    }

    // Call this when the user leaves the game
    const leaveGame = function(){
        console.log("leaving game");
        socket.emit(SocketEvents.LEAVE_GAME);
    }

    // Call this when the player holds down a key in game
    // action could be the key that the player pressed or some sort of enum 
    const onKeyDown = function(action){
        // console.log("player pressed " + action);
        socket.emit(SocketEvents.ON_KEY_DOWN, JSON.parse(action));
    }

    // Call this when the player stops pressing a key in game
    // action could be the key that the player pressed or some sort of enum 
    const onKeyUp = function(action){
        // console.log("player stopped pressing " + action);
        socket.emit(SocketEvents.ON_KEY_UP, JSON.parse(action));
    }

    const onMouseMove = function(action){
        // console.log("player stopped pressing " + action);
        socket.emit(SocketEvents.ON_MOUSE_MOVE, JSON.parse(action));
    }

    return { 
        getSocket, 
        connect, 
        disconnect, 
        joinQueue, 
        leaveQueue,
        ready,
        leaveGame,
        onMouseMove,
        onKeyDown,
        onKeyUp};
})();

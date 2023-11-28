const Socket = (function () {
    // This stores the current Socket.IO socket
    let socket = null;
    let gameLoopStarted = false;

    let cv = null;
    let context = null;

    // This function gets the socket from the module
    const getSocket = function () {
        return socket;
    };

    // This function connects the server and initializes the socket
    const connect = function () {
        socket = io();
        // Wait for the socket to connect successfully
        cv = $("canvas").get(0);
        context = cv.getContext("2d");
        PlatformStateListener.init({ context, socket });
        PlayerStateListener.init({ context, socket });
        BulletStateListener.init({context, socket});
        MapStateListener.init({context, socket});
        socket.on(SocketEvents.CONNECT, () => {
        });
        socket.on(SocketEvents.CONNECT_ERROR, (err) => {
            console.log(`Connect error due to ${err.message}`);
        });

        // Acknowledgement from server that user joined queue, if they couldn't join a game.
        socket.on(SocketEvents.JOINED_QUEUE, (queue_position) => {
            // TODO: change UI to show that user has been queued up. Change the queue up button to leave queue button.
            // TODO: maybe add a mechanism to stop someone from spamming the queue button.

            // update the appearance of the queue button
            Lobby.update(false);
            // update console to inform client queue has been joined
            Console.update("Joined Queue! Position: " + queue_position);

        });

        // Acknowledgement from server that user left queue.
        socket.on(SocketEvents.LEFT_QUEUE, () => {
            // TODO: change UI to show that user has left the queue. Change the leave queue button to join queue button.
            // TODO: maybe add a mechanism to stop someone from spamming the queue button.
            // update the appearance of the queue button
            console.log("Left queue called");
            Lobby.update(true);
            // update console to inform client queue has been joined
            Console.update("Left queue!");

        });

        socket.on(SocketEvents.LOAD_LEVEL, () => {
            async function setupGame() {
                console.log("Load Level called!");
            
                // reset the queue button
                Lobby.update(true);
                // Hide UI
                $("#container").hide();
            
                
                BackgroundGenerator.generateBackground("#staticBackground");
            
                
            
                // Wait for both load promises to resolve
                await Promise.all([PlatformStateListener.loadPromise, PlayerStateListener.loadPromise]);
                InputStateManager.init({ socket: socket, cv: cv, username: Authentication.getUser().username });
                console.log("emitting ready");
                socket.emit(SocketEvents.READY);
            }
            
            setupGame();

        })


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
            console.log("Start game loop called!");

            let startTime;
            let elapsedTime;
            gameLoopStarted = true;
            requestAnimationFrame(gameLoop);
            function gameLoop(timestamp) {

                if (!startTime) {
                    startTime = timestamp;
                }

                elapsedTime = timestamp - startTime;
                context.clearRect(0, 0, cv.width, cv.height);
                PlatformStateListener.draw();
                PlayerStateListener.update(timestamp);
                PlayerStateListener.draw();
                BulletStateListener.draw();
                MapStateListener.draw();
                MapStateListener.update(timestamp);
                if (gameLoopStarted) {
                    requestAnimationFrame(gameLoop);
                }
            }



        });
        socket.on(SocketEvents.STOP_GAME_LOOP, () => {
            game_loop_started = false;
        });

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
    const disconnect = function () {
        socket.disconnect();
        socket = null;
    };

    // join queue
    const joinQueue = function () {
        console.log("joining queue");
        socket.emit(SocketEvents.JOIN_QUEUE);
    }

    // leave queue
    const leaveQueue = function () {
        console.log("leaving queue");
        socket.emit(SocketEvents.LEAVE_QUEUE);
    }

    // Call this when the level is done loading, maybe call this via a promise.
    const ready = function () {
        console.log("Done loading")
        socket.emit(SocketEvents.READY);
    }

    // Call this when the user leaves the game
    const leaveGame = function () {
        console.log("leaving game");
        socket.emit(SocketEvents.LEAVE_GAME);
    }

  

    return {
        getSocket,
        connect,
        disconnect,
        joinQueue,
        leaveQueue,
        ready,
        leaveGame
    };
})();

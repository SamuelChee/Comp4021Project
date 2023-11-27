/**
 * This function provides a listener for Player events.
 * It enables initializing player states, updating them, drawing them on the canvas, and accessing player information.
 */ 
const PlayerStateListener = (function () {
    // Define the context for drawing, the socket for communication, and the players object to hold player states
    let context = null;
    let socket = null;
    let players = {};

    //flag to check if all players have been loaded
    let isLoaded = false; 


    // Keep track of the previous actions and directions of each player
    const prevAction = {};
    const prevDirection = {};

    /**
     * Initialize the listener with the given context and socket
     * @param {Object} params - The context and socket to use
     */
    const init = function ({ context, socket}) {
        context = context;
        socket = socket;

        // Listen for 'load level' event to initialize player states
        socket.on(SocketEvents.LOAD_LEVEL, function (event) {
            const eventData = JSON.parse(event);
            console.log(eventData);

            // Map player states from the event data to the players object
            players = Object.entries(eventData[LoadLevelProps.PLAYER_STATES]).reduce((result, [username, playerState]) => {
                result[username] = Player(context, playerState[PlayerStateProps.X], playerState[PlayerStateProps.Y]);
                console.log(playerState[PlayerStateProps.X], playerState[PlayerStateProps.Y]);
                result[username].setWeapon(playerState[PlayerStateProps.WEP_ID]);

                prevAction[username] = null;
                prevDirection[username] = null;
                return result;
            }, {});

            isLoaded = true; // Set flag to true after populating the players object
        });

        // Listen for 'update' event to update player states and trigger appropriate animations
         socket.on(SocketEvents.UPDATE, (update) => {
            const updateObj = JSON.parse(update);

            Object.entries(updateObj.playerStates).forEach(([username, playerState]) => {
                // Update player's coordinates and weapon rotation
                players[username].setXY(playerState[PlayerStateProps.X], playerState[PlayerStateProps.Y]);
                players[username].setWeaponRotation(playerState[PlayerStateProps.AIM_ANGLE]);
                let action = playerState[PlayerStateProps.ACTION];
                let direction = playerState[PlayerStateProps.DIRECTION];
                // If the player's action or direction has changed, trigger the appropriate animation
                if (action !== prevAction[username] || direction !== prevDirection[username]) {
                    if (action === Actions.IDLE) {
                        players[username].idle_animation(direction);
                    } else if (action === Actions.MOVE) {
                        players[username].move_animation(direction);
                    }

                    prevAction[username] = action;
                    prevDirection[username] = direction;
                }
            });
        });
    }

    /**
     * Draw each player on the canvas
     */
    const draw = function () {
        for (let player of Object.values(players)) {
            player.draw();
        }
    }

    /**
     * Update each player's state with the given timestamp
     * @param {number} timestamp - The timestamp to use for the update
     */
    const update = function (timestamp) {
        for (let player of Object.values(players)) {
            player.update(timestamp);
        }
    }

    /**
     * Get a player's state by their username
     * @param {string} username - The username of the player
     * @return {Object} The player's state
     */
    const getPlayer = function (username) {
        return players[username];
    }

    const getIsLoaded = function () {
        return isLoaded; 
    }


    // Return the public methods
    return {
        init: init,
        draw: draw,
        update: update,
        getPlayer: getPlayer,
        getIsLoaded
    };
})();
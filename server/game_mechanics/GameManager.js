const GameManager = function(id, io){

    // Mainly server stuff
    let playerInfos = {}; // contains name, avatar and profile
    let usernames = [];
    let sockets = {};
    let isReady = {};
    let socket = io;

    // Gameplay stuff
    let players = {};
    const Map = require("./Map");
    let map = Map(); // Creates a new instance of `Map`
    let gameID = id;

    // Collision stuff
    

    const initialize = function(account1, account2, mapInfo, player_socket){
        // Initialize map
        map.initialize(account1, account2, mapInfo);

        // initialize player information. Contains username, name, avatar and username of opponent.
        // playerInfos[account1.username] = {
        //     name: account1.name, 
        //     avatar: account1.avatar, 
        //     profile: account1.profile,
        //     opponent: account2.username};

        // playerInfos[account2.username] = {
        //     name: account2.name, 
        //     avatar: account2.avatar, 
        //     profile: account2.profile,
        //     opponent: account1.username};


        // Initialize usernames:
        // usernames.push(account1.username);
        // usernames.push(account2.username);
        
        // Initialize sockets
        // sockets = playerSockets;

        // Initialize is ready
        // isReady[account1.username] = false;
        // isReady[account2.username] = false;

        // Init players
        // let player1 = PlayerState(
        //     player1Info, 
        //     map.getPlayerInitialPos(account1.username),
        //     map.getPlayerInitialDir(account1.username)
        //     );

        // let player2 = PlayerState(player2Info, map.getPlayerInitialPos(account2.username));

        // players[account1.username] = player1;
        // players[account2.username] = player2;

        // contains information related to gameplay, e.g. health, position, direction
        // let playerStates = {};
        // playerStates[account1.username] = players[account1.username].getPlayerState();
        // playerStates[account2.username] = players[account2.username].getPlayerState();

        // Make players join a room
        // Put player sockets in a room:
        // account1.socket.join(JSON.stringify(gameID));
        // account2.socket.join(JSON.stringify(gameID));
        // player_socket.join(JSON.stringify(gameID))
        
        // Tell all clients to start loading their levels
        console.log("emitting");
        socket.emit("load level", JSON.stringify({
            gameID, 
            map: map.getMapInfo(),
        }));
        // socket.to(JSON.stringify(gameID)).emit("load level", JSON.stringify({
        //     gameID, 
        //     // usernames, 
        //     map: map.getMapInfo(),
        //     // playerInfos,
        //     // playerStates
        // }));
    };

    // Check if user's client is done loading the level. Once both players are ready, start the game.
    const ready = function(username){
        // Just double checking, not necessary
        if(username in players){
            isReady[username] = true;
            let canStart = true;

            for(let i = 0; i < usernames.length; i++){
                let username = usernames[i];
                if(!isReady[username]){
                    canStart = false;
                    break;
                }
            }
            if(canStart){
                start();
            }
        }
    };

    // The function to start the game, maybe run this after everything is done loading in the client side.
    const start = function(){
        // Tell the clients that the game can start
        socket.to(JSON.stringify(gameID)).emit("start");

        // TODO: Start GameLoop, or put this in a timer if we need a countdown before starting the game.
        update();
    };

    // TODO: Check win condition, if a user wins the game, notify players.
    function checkWinCondition(){

    }

    // TODO: run this if a win condition has been met.
    function gameOver(winner){
        // TODO: Stop the gameloop timers


        // send the winner along with the player statistics
        let statistics = {};
        for(let i = 0; i < usernames.length; i++){
            let username = usernames[i];
            let player = players[username];

            statistics[username] = {playerState: player.getPlayerState(),Statistics: player.getPlayerStatistics(), winner: winner == username};
        }


        // winner is the username of the winner
        socket.to(JSON.stringify(gameID)).emit("gameOver", JSON.stringify(statistics));
    }

    // Update function or gameloop
    const update = function(){
        // TODO: run update repeatedly using a timer.

        // object to send information to client about the game state.
        let updateObject = {};
        // emit object to all clients in the game.
        socket.to(JSON.stringify(gameID)).emit("update", JSON.stringify(updateObject));
    };

    const getID = function(){
        return matchID;
    };

    const disconnectPlayer = function(username){
        // TODO: disconnect the player 

        sockets[username].broadcast.to(JSON.stringify(gameID)).emit("player left", JSON.stringify(playerInfos[username]));

        // kick the player out of the room
        sockets[username].leave(JSON.stringify(gameID));

        // if a player leaves mid game, handle game over mechanics, otherwise just send player
        // back to lobby.
        if(!checkWinCondition()){
            gameOver(playerInfos[username].opponent);
        }


        return {username: username, profile: players[username].profile};   
    };

    // Consider this function to handle key down events
    const processKeyDown = function(username, action){
        // TODO: process key down event
         

    };

    // Consider this function to handle key up events
    const processKeyUp = function(username, action){
        // TODO: process key up event 
    };

    return {initialize, getID, disconnectPlayer, start, update, ready, processKeyDown, processKeyUp};
};

module.exports = GameManager;

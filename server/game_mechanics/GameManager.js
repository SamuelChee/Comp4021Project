const InputStateManager = require("./InputStateManager");
const Map = require("./Map");
const PlayerState = require("./PlayerState");


const GameManager = function(id, io){

    // Mainly server stuff
    let playerInfos = {}; // contains name, avatar and profile
    let playerStates = {};
    let usernames = [];
    let sockets = {};
    let isReady = {};
    let socket = io;

    // Gameplay stuff
    let players = {};
    
    let map = Map(); // Creates a new instance of `Map`
    let inputStateManager = InputStateManager();
    let gameID = id;

    // Collision stuff
    

    const initialize = function(account1, account2, mapInfo, player_socket){
        // Initialize map
        let username = "username";
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
        let player1 = PlayerState(
            null, {x: 50, y: 430}
        );

        // let player2 = PlayerState(player2Info, map.getPlayerInitialPos(account2.username));
        playerStates[username] = player1;
        // players[account1.username] = player1;
        // players[account2.username] = player2;

        // contains information related to gameplay, e.g. health, position, direction
        // playerStates[username] = players[username].getPlayerState();
        // playerStates[account2.username] = players[account2.username].getPlayerState();

        // Make players join a room
        // Put player sockets in a room:
        // account1.socket.join(JSON.stringify(gameID));
        // account2.socket.join(JSON.stringify(gameID));
        // player_socket.join(JSON.stringify(gameID))
        let obj = {"username": {x : 50, y: 465, wepID: 0}};
        // Tell all clients to start loading their levels
        console.log("emitting load level");
        socket.emit("load level", JSON.stringify({
            gameID, 
            playerStates: obj,
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
        // if(username in players){
        //     isReady[username] = true;
        //     let canStart = true;

        //     for(let i = 0; i < usernames.length; i++){
        //         let username = usernames[i];
        //         if(!isReady[username]){
        //             canStart = false;
        //             break;
        //         }
        //     }
        //     if(canStart){
        //         start();
        //     }
        // }

        start();
    };

    // The function to start the game, maybe run this after everything is done loading in the client side.
    const start = function(){
        // Tell the clients that the game can start
        // socket.to(JSON.stringify(gameID)).emit("start");
        console.log("emit start")
        socket.emit("start");

        // TODO: Start GameLoop, or put this in a timer if we need a countdown before starting the game.
        // Start the game loop
        setInterval(update, 1000 / 60); // Call update() every ~16.67 ms to achieve ~60 updates per second
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
        // console.log("updating repeatedly");
        // object to send information to client about the game state.

        // console.log(action);
        
        playerStates["username"].update(inputStateManager)
        let playerStateObj = playerStates["username"].getObj();
        // console.log(playerStateObj);
        let updateObject = {playerState: playerStateObj};
        // pos = playerStates["username"].getPlayerPosition();
        // dir = playerStates["username"].getPlayerDirection();
        // console.log(dir);
        // updateObject.playerStates = {"username": {x: pos.x, y: pos.y, direction: dir}};
        // console.log(updateObject);
        // emit object to all clients in the game.
        // socket.to(JSON.stringify(gameID)).emit("update", JSON.stringify(updateObject));
        socket.emit("update", JSON.stringify(updateObject));
    };

    const getID = function(){
        return matchID;d
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
    const processKeyDown = function(keyEventObj){
        // TODO: process key down event
        inputStateManager.updateKeyDown(keyEventObj.username, keyEventObj.key);

    };

    // Consider this function to handle key up events
    const processKeyUp = function(keyEventObj){
        inputStateManager.updateKeyUp(keyEventObj.username, keyEventObj.key);

        // TODO: process key up event 
    };

    const processMouseMove = function(mouseEventObj){
        inputStateManager.updateAimAngle(mouseEventObj.username, mouseEventObj.angle)
    };

    return {initialize, getID, disconnectPlayer, start, update, ready, processKeyDown, processKeyUp, processMouseMove};
};

module.exports = GameManager;

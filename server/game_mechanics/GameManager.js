const InputStateManager = require("./InputStateManager");
const Map = require("./Map");
const PlayerStateManager = require("./PlayerStateManager");

const {
    Directions,
    Keys,
    Actions,
    PlayerStateProps,
    PlatformDataProps,
    LoadLevelProps,
    ServerUpdateProps,
    KeyEventProps,
    MouseEventProps
} = require('../../shared/constants');

const GameManager = function(id, io){

    // Mainly server stuff
    let playerInfos = {}; // contains name, avatar and profile
    // let playerStates = {};
    let usernames = [];
    let sockets = {};
    let isReady = {};
    let socket = io;

    // Gameplay stuff
    let players = {};
    
    let map = Map(); // Creates a new instance of `Map`
    let inputStateManager = InputStateManager();
    let playerStateManager = PlayerStateManager();
    let gameID = id;

    // Collision stuff
    

    const initialize = function(account1, account2, mapState, player_socket){
        // Initialize map
        let username = "username";
        map.initialize(account1, account2, mapState);


        playerStateManager.addPlayer(username, {x: 50, y: 430}, 0)


        console.log("emitting load level");
        socket.emit("load level", JSON.stringify({
            [LoadLevelProps.GAME_ID]: gameID,
            [LoadLevelProps.PLAYER_STATES]: playerStateManager.getAllPlayerStates(),
            [LoadLevelProps.MAP_STATE]: map.getMapState(),
        }));

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

        
        playerStateManager.update(inputStateManager);
        let updateObject = {[ServerUpdateProps.PLAYER_STATES]: playerStateManager.getAllPlayerStates()};

        socket.emit("update", JSON.stringify(updateObject));
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

    const processKeyDown = function(keyEventObj){
        inputStateManager.updateKeyDown(keyEventObj[KeyEventProps.USERNAME], keyEventObj[KeyEventProps.KEY]);
    };

    // Consider this function to handle key up events
    const processKeyUp = function(keyEventObj){
        inputStateManager.updateKeyUp(keyEventObj[KeyEventProps.USERNAME], keyEventObj[KeyEventProps.KEY]);
    };

    const processMouseMove = function(mouseEventObj){
        inputStateManager.updateAimAngle(mouseEventObj[MouseEventProps.USERNAME], mouseEventObj[MouseEventProps.Angle])
    };

    return {initialize, getID, disconnectPlayer, start, update, ready, processKeyDown, processKeyUp, processMouseMove};
};

module.exports = GameManager;

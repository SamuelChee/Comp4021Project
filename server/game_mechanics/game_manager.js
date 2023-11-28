const {InputStateListener} = require("./input_state_listener");
const {Map} = require("./map");
const {PlayerStateManager} = require("./player_state_manager");
const {BulletStateManager} = require("./bullet_state_manager");
const {CollisionManager} = require("./collision_manager");

const {
    Directions,
    Keys,
    Actions,
    PlayerStateProps,
    PlatformDataProps,
    LoadLevelProps,
    ServerUpdateProps,
    KeyEventProps,
    MouseEventProps,
    SocketEvents,
    PlayerConsts,
    BulletStateProps,
    BulletProps,
    BulletTypes,
    
} = require('../../shared/constants');

const GameManager = function(id, io){

    // Mainly server stuff
    let playerInfos = {}; // contains name, avatar and profile

    // let playerStates = {};
    let usernames = [];
    let player_sockets = {};
    let isReady = {};
    let server_socket = io;
    let self = null;

    // Gameplay stuff
    let players = {};
    
    let map = Map(); // Creates a new instance of `Map`

    let bulletStateManager = null;
    let inputStateListener = null;
    let playerStateManager = null;
    let collisionManager = null;
    let gameID = id;

    // Projectile stuff
    // Each projectile is represented by the following
    // {ID, boundingBox, position, direction, speed, damage, width, height}
    let projectiles = {};
    

    const initialize = function(account1, account2, mapState, sockets, instance){
        // Initialize map
        map.initialize(account1, account2, mapState);

        // A way for the manager to refer to itself;
        self = instance;

        // Init managers
        bulletStateManager = BulletStateManager(self);
        playerStateManager = PlayerStateManager(self);
        inputStateListener = InputStateListener(self);
        collisionManager = CollisionManager(self);

        // initialize player information. Contains username, name, avatar and username of opponent.
        playerInfos[account1.username] = {
            name: account1.name, 
            avatar: account1.avatar, 
            profile: account1.profile,
            opponent: account2.username};

        playerInfos[account2.username] = {
            name: account2.name, 
            avatar: account2.avatar, 
            profile: account2.profile,
            opponent: account1.username};

        // initialize projectiles
        projectiles[account1.username] = {};
        projectiles[account2.username] = {};

        playerStateManager.addPlayer(account1.username, {x: PlayerConsts.PLAYER_1_INI_X, y: PlayerConsts.PLAYER_1_INI_Y}, PlayerConsts.PLAYER_1_INI_WEP_ID);
        playerStateManager.addPlayer(account2.username, {x: PlayerConsts.PLAYER_2_INI_X, y: PlayerConsts.PLAYER_2_INI_Y}, PlayerConsts.PLAYER_2_INI_WEP_ID);
        
        player_sockets = sockets;
        // Make players join a room
        // Put player sockets in a room:
        player_sockets[account1.username].join(JSON.stringify(gameID));
        player_sockets[account2.username].join(JSON.stringify(gameID));

        isReady[account1.username] = false;
        isReady[account2.username] = false;

        console.log("emitting load level");
        server_socket.to(JSON.stringify(gameID)).emit(SocketEvents.LOAD_LEVEL, JSON.stringify({
            [LoadLevelProps.GAME_ID]: gameID,
            [LoadLevelProps.PLAYER_STATES]: playerStateManager.getAllPlayerStates(),
            [LoadLevelProps.MAP_STATE]: map.getMapState(),
        }));

    };

    // Check if user's client is done loading the level. Once both players are ready, start the game.
    const ready = function(username){
        console.log("game manager ready");
        // Just double checking, not necessary
        if(username in playerInfos){
            isReady[username] = true;
            let canStart = true;
    
            console.log('Checking readiness for all players...'); // Add this line
    
            for(let i = 0; i < usernames.length; i++){
                let username = usernames[i];
                console.log('Checking readiness for', username, ':', isReady[username]); // And this line
                if(!isReady[username]){
                    canStart = false;
                    break;
                }
            }
            if(canStart){
                console.log("can start");
                start();
            } else {
                console.log("Not all players are ready"); // And this line
            }
        }
    };

    // The function to start the game, maybe run this after everything is done loading in the client side.
    const start = function(){
        // Tell the clients that the game can start
        // server_socket.to(JSON.stringify(gameID)).emit("start");
        console.log("emit start")
        server_socket.to(JSON.stringify(gameID)).emit(SocketEvents.START_GAME_LOOP);

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
        server_socket.to(JSON.stringify(gameID)).emit(SocketEvents.GAME_OVER, JSON.stringify(statistics));
    }


    // Update function or gameloop
    const update = function(){

        playerStateManager.update(inputStateListener);
        bulletStateManager.update(playerStateManager, inputStateListener);
        collisionManager.update();
        let updateObject = {
            [ServerUpdateProps.PLAYER_STATES]: playerStateManager.getAllPlayerStates(),
            [ServerUpdateProps.BULLET_STATES]: bulletStateManager.getAllBulletStates()
        };

        server_socket.to(JSON.stringify(gameID)).emit(SocketEvents.UPDATE, JSON.stringify(updateObject));
    };

    const getID = function(){
        return matchID;
    };

    const disconnectPlayer = function(username){
        // TODO: disconnect the player 

        player_sockets[username].broadcast.to(JSON.stringify(gameID)).emit(SocketEvents.PLAYER_LEFT, JSON.stringify(playerInfos[username]));

        // kick the player out of the room
        player_sockets[username].leave(JSON.stringify(gameID));

        // if a player leaves mid game, handle game over mechanics, otherwise just send player
        // back to lobby.
        if(!checkWinCondition()){
            gameOver(playerInfos[username].opponent);
        }


        return {username: username, profile: playerInfos[username].profile};     
    };

    const processKeyDown = function(keyEventObj){
        let parsedKeyEventObj = JSON.parse(keyEventObj);
        inputStateListener.updateKeyDown(parsedKeyEventObj[KeyEventProps.USERNAME], parsedKeyEventObj[KeyEventProps.KEY]);
    };

    // Consider this function to handle key up events
    const processKeyUp = function(keyEventObj){
        let parsedKeyEventObj = JSON.parse(keyEventObj);
        inputStateListener.updateKeyUp(parsedKeyEventObj[KeyEventProps.USERNAME], parsedKeyEventObj[KeyEventProps.KEY]);
    };

    const processMouseMove = function(mouseEventObj){
        let parsedmouseEventObj = JSON.parse(mouseEventObj);
        inputStateListener.updateAimAngle(parsedmouseEventObj[MouseEventProps.USERNAME], parsedmouseEventObj[MouseEventProps.ANGLE])
    };


    const processMouseDown = function(mouseEventObj){

        let parsedmouseEventObj = JSON.parse(mouseEventObj);
        inputStateListener.updateKeyDown(parsedmouseEventObj[MouseEventProps.USERNAME], Keys.SHOOT);

    };

    const processMouseUp = function(mouseEventObj){
        let parsedmouseEventObj = JSON.parse(mouseEventObj);
        inputStateListener.updateKeyUp(parsedmouseEventObj[MouseEventProps.USERNAME], Keys.SHOOT);
    }

    const getGameArea = function(){
        return map.getGameArea();
    }

    const getMap = function(){
        return map;
    }
    const getPlayerStateManager = function(){
        return playerStateManager;
    }

    return {
        initialize, 
        getID, 
        disconnectPlayer, 
        start, 
        update, 
        ready, 
        processKeyDown, 
        processKeyUp, 
        processMouseMove,
        getGameArea,
        getMap, 
        processMouseDown, 
        getPlayerStateManager,
        processMouseUp};
};

if(typeof(module) === "object")
    module.exports = {GameManager};

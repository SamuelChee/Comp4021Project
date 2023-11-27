const {PlayerState} = require("./PlayerState");
const {Map} = require("./Map");
const {Util} = require("../../Util/Util");

const GameManager = function(id, io){

    // Mainly server stuff
    let playerInfos = {}; // contains name, avatar and profile
    let usernames = [];
    let sockets = {};
    let isReady = {};
    let socket = io;

    // Gameplay stuff
    let players = {};
    let map = Map();
    let gameID = id;

    // Each projectile is represented by the following
    // {ID, boundingBox, position, direction, speed, damage, width, height}
    let projectiles = {};


    const initialize = function(account1, account2, mapInfo, playerSockets){
        // Initialize map
        map.initialize(account1, account2, mapInfo);

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

        // Initialize usernames:
        usernames.push(account1.username);
        usernames.push(account2.username);
        
        // Initialize sockets
        sockets = playerSockets;

        // Initialize is ready
        isReady[account1.username] = false;
        isReady[account2.username] = false;

        // Init players
        let player1 = PlayerState(
            player1Info, 
            map.getPlayerInitialPos(account1.username),
            map.getPlayerInitialDir(account1.username)
            );

        let player2 = PlayerState(player2Info, 
            map.getPlayerInitialPos(account2.username),
            map.getPlayerInitialDir(account1.username));

        players[account1.username] = player1;
        players[account2.username] = player2;

        // contains information related to gameplay, e.g. health, position, direction
        let playerStates = {};
        playerStates[account1.username] = players[account1.username].getPlayerState();
        playerStates[account2.username] = players[account2.username].getPlayerState();

        // Make players join a room
        // Put player sockets in a room:
        account1.socket.join(JSON.stringify(gameID));
        account2.socket.join(JSON.stringify(gameID));
        
        // Tell all clients to start loading their levels
        socket.to(JSON.stringify(gameID)).emit("load level", JSON.stringify({
            gameID, 
            usernames, 
            map: map.getMapInfo(),
            playerInfos,
            playerStates}));
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

    // time since last update
    let gameStartTime = 0;
    let timeSinceLastUpdate = 0;

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
    // Check collisions of items for each player
    function checkItemCollisions(){
        
    }

    // Checks collision of projectile for each player
    function checkProjectileCollisions(){
        let projectileCollisions = {};

        // for every player in the game
        for(username in usernames){
            let collisions = [];
            let playerState = players[username];

            // Get projectiles made by their opponent
            let enemyProjectiles = projectiles[playerInfos[username].opponent];

            // Check collisions
            for(const [key, value] of Object.entries(enemyProjectiles)){
                if(playerState.detectCollision(value.box)){
                    playerState.takeDamage(value.damage); // tell the player to take damage
                    collisions.push({id: key}); // register the collision to client
                }
            }

            // delete bullets that collided with player
            for(collision in collisions){
                delete enemyProjectiles[collision.id];
            }
            
            projectileCollisions[username] = collisions;
        }

        return projectileCollisions;
    }

    // Update function or gameloop
    const update = function(){
        // TODO: run update repeatedly using a timer.
        if(gameStartTime == 0){
            gameStartTime = Date.now();
        }

        // object to send information to client about the game state.
        let updateObject = {};

        // Returns the bullets to be deleted (already deleted in server)
        updateObject.projectileCollisions = checkProjectileCollisions();
        // Returns the updated list of bullets that still survive

        updateObject.projectiles = projectiles;
        

        // update last update time;

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

    // Const use this function to spawn a projectile,
    // Projectile should been drawn in the next update.
    
    // bad code but good enough
    const spawnProjectile = function(username){
        // generates an id that is not in the projectile list
        let id = Util.generateID(projectiles[username]);

        // get starting direction and position of projectile
        let direction = players[username].getPlayerState().aimDirection;
        let position = players[username].getPlayerState().position;

        let speed = 100; // TODO: change this
        let damage = 3; // TODO: change this
        let width = 10; // TODO: change this
        let height = 10; // TODO: change this

        // NOTE: Use a symmetric shape to represent a bullet, like a circle or something so we don't have to deal
        // with rotations.
        let box = BoundingBox(
            position.y - height / 2, 
            position.x - width / 2, 
            position.y + height/2, 
            position.x + width / 2);

        projectiles[username][id] = {
            box, direction, speed, damage, width, height
        };
    }

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

if(typeof(module) === "object")
    module.exports = {GameManager};
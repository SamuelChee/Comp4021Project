// Importing necessary constants from shared constants file
const {
    Directions,
    Keys,
    Actions,
    PlayerStateProps,
    PlatformDataProps,
    LoadLevelProps,
    ServerUpdateProps,
    WepProps,
    PlayerConsts
} = require('../../shared/constants');

const {BoundingBox} = require('./bounding_box');

// A constructor function for managing player states
const PlayerStateManager = function (manager) {

    // Object to store all players' states
    let players = {};
    let prevPlayerPositions = {};

    // A way for player state manager to communicate with manager
    let gameManager = manager;

    // Function to add a player and initialize their state
    const addPlayer = function (username, initPosition, wepID) {
        // init bounding box for player
        let box = BoundingBox(
            initPosition.y - PlayerConsts.SPRITE_HEIGHT / 2,
            initPosition.x - PlayerConsts.SPRITE_WIDTH / 2,
            initPosition.y + PlayerConsts.SPRITE_HEIGHT / 2,
            initPosition.x + PlayerConsts.SPRITE_WIDTH / 2
        );

        players[username] = {
            [PlayerStateProps.X_INI]: initPosition.x, // Initial X position
            [PlayerStateProps.Y_INI]: initPosition.y, // Initial Y position
            [PlayerStateProps.X]: initPosition.x, // Current X position
            [PlayerStateProps.Y]: initPosition.y, // Current Y position
            [PlayerStateProps.X_VEL]: 5, // X velocity
            [PlayerStateProps.ACTION]: Actions.IDLE, // Current action (initially idle)
            [PlayerStateProps.DIRECTION]: Directions.RIGHT, // Current direction (initially right)
            [PlayerStateProps.AIM_ANGLE]: 0, // Current aim angle
            [PlayerStateProps.Y_VEL]: 0, // Y velocity
            [PlayerStateProps.TERMINAL_Y_VEL]: 20, // Terminal Y velocity
            [PlayerStateProps.JUMP_VEL]: -25, // Jump velocity
            [PlayerStateProps.GRAVITATIONAL_ACC]: 1.5, // Gravitational acceleration
            [PlayerStateProps.IS_FALLING]: true, // Is player currently falling? (initially false)
            [PlayerStateProps.X_DIRECTION_MULTIPLE]: { // Direction multipliers for X velocity
                [Directions.LEFT]: -1,
                [Directions.RIGHT]: 1
            },
            [PlayerStateProps.WEP_ID]: wepID, // Player's weapon ID
            [PlayerStateProps.AMMO]: WepProps[wepID].INI_AMMO,
            [PlayerStateProps.BOX]: box,
            [PlayerStateProps.PLATFORM_IDX]: -1
        };

        players[username][PlayerStateProps.BOX].printBox()
    }

    // Checks for collisions between bounding boxes
    const detectCollision = function(username, box){
        return box.isPointInBox(players[username][PlayerStateProps.X], players[username][PlayerStateProps.Y]);
    }

    const takeDamage = function(damage){
        health -= damage;
    }

    const isDead = function(){
        return health <= 0;
    }
    // A method to shoot a bullet which decrements the bullet count
    const shootBullet = function (username) {
        if (players[username][PlayerStateProps.AMMO] > 0) {
        players[username][PlayerStateProps.AMMO]--;
        return true;
        } 
        return false;
    }
    const getPrevPlayerPos = function(username){
        return prevPlayerPositions[username];
    }
    // Function to update players' states based on their inputs
    const update = function (inputStateListener) {
        for (let username in players) {
            let player = players[username];
            if (!prevPlayerPositions[username]) {
                prevPlayerPositions[username] = {};
            }
            prevPlayerPositions[username][PlayerStateProps.X] = player[PlayerStateProps.X];
            prevPlayerPositions[username][PlayerStateProps.Y] = player[PlayerStateProps.Y];
            // If player is falling, update Y velocity and position
            if (player[PlayerStateProps.IS_FALLING]) {
                if (player[PlayerStateProps.Y_VEL] < player[PlayerStateProps.TERMINAL_Y_VEL]) {
                    player[PlayerStateProps.Y_VEL] += player[PlayerStateProps.GRAVITATIONAL_ACC];
                }
                player[PlayerStateProps.Y] += player[PlayerStateProps.Y_VEL];
            }
            // If jump key is pressed, set Y velocity to jump velocity and set falling to true
            else if (inputStateListener.getKeyPressed(username, Keys.JUMP)) {
                player[PlayerStateProps.Y_VEL] = player[PlayerStateProps.JUMP_VEL];
                player[PlayerStateProps.IS_FALLING] = true;
            }

            // If left or right key is pressed, update direction, action, and X position
            if (inputStateListener.getKeyPressed(username, Keys.LEFT)) {
                // console.log("key pressed left");
                player[PlayerStateProps.DIRECTION] = Directions.LEFT;
                player[PlayerStateProps.ACTION] = Actions.MOVE;
                player[PlayerStateProps.X] += player[PlayerStateProps.X_VEL] * player[PlayerStateProps.X_DIRECTION_MULTIPLE][player[PlayerStateProps.DIRECTION]];
            }
            else if (inputStateListener.getKeyPressed(username, Keys.RIGHT)) {
                // console.log("key pressed right");
                player[PlayerStateProps.DIRECTION] = Directions.RIGHT;
                player[PlayerStateProps.ACTION] = Actions.MOVE;
                player[PlayerStateProps.X] += player[PlayerStateProps.X_VEL] * player[PlayerStateProps.X_DIRECTION_MULTIPLE][player[PlayerStateProps.DIRECTION]];
            }
            // If neither left nor right key is pressed, set action to idle
            else {
                player[PlayerStateProps.ACTION] = Actions.IDLE;
            }
            
            // Update aim angle based on input state manager
            player[PlayerStateProps.AIM_ANGLE] = inputStateListener.getAimAngle(username);
        }
    }

    // Function to get a player's position
    const getPlayerPosition = function (username) {
        return {
            x: players[username][PlayerStateProps.X],
            y: players[username][PlayerStateProps.Y]
        };
    }

    
    
    
   /*
   const checkPlatformCollisions = function(username, originalPos){
        let player = players[username];
        let y_vel = player[PlayerStateProps.Y_VEL];
        const platforms = gameManager.getMap().getPlatformBoxes();

        for(let i = 0; i < platforms.length; i++){
            // get intersection 
            const platform = platforms[i];
            
            console.log("Player point: " + player[PlayerStateProps.X] + " " + player[PlayerStateProps.Y])
            platform.printBox();
            console.log("Point in box? " + platform.isPointInBox(player[PlayerStateProps.X], player[PlayerStateProps.Y]));
            

            if(platform.isPointInBox(player[PlayerStateProps.X], player[PlayerStateProps.Y])){
                console.log("Intersect with box! " + i);
                break;
            }
        } 
    }
    */


    // Function to get a player's direction
    const getPlayerDirection = function (username) {
        return players[username][PlayerStateProps.DIRECTION];
    }

    // Function to get the full state of a specific player
    const getPlayerState = function (username) {
        return players[username];
    }

    // Function to get the full state of all players
    const getAllPlayerStates = function () {
        return players;
    }

    // function to get all collisions given a set of bounding boxes.
    // boxes is a dictionary where the key are the usernames and the values are {id, box}
    // const getCollisions = function(boxes){
    //     // The output collision objects key: username, value array of [id, player y velocity]
    //     let collisions = {};
    //     for(const username in usernames){
    //         let boxesToCheck = boxes[username];
    //         let y_vel = players[username][PlayerStateProps.Y_VEL];
    //         let collisionForUser = [];

    //         for(const box in boxesToCheck){
    //             // if collision is detected
    //             if(detectCollision(username, box.box)){
    //                 let detection = {};
    //                 detection[id] = box.id;
    //                 detection[PlayerStateProps.Y_VEL] = y_vel;

    //                 collisionForUser.push(detection);
    //             }
    //         }

    //         collisions[username] = collisionForUser;
    //     }

    //     return collisions;
    // }

    // Expose public methods
    return {
        addPlayer,
        update,
        getPlayerPosition,
        getPlayerDirection,
        getPlayerState,
        getAllPlayerStates,
        detectCollision,
        takeDamage,
        shootBullet,
        isDead,
        getPrevPlayerPos
        // updateBoundingBox,
        // getCollisions
    };
};

// Export the PlayerStateManager constructor function
module.exports = {PlayerStateManager};
// Importing necessary constants from shared constants file
const {
    Directions,
    Keys,
    Actions,
    PlayerStateProps,
    PlatformDataProps,
    LoadLevelProps,
    ServerUpdateProps,
    PlayerConsts
} = require('../../shared/constants');

const {BoundingBox} = require('./bounding_box');
// A constructor function for managing player states
const PlayerStateManager = function () {

    // Object to store all players' states
    let players = {};

    let bounding_box = null;
    // Function to add a player and initialize their state
    const addPlayer = function (username, initPosition, wepID) {

        bounding_box = BoundingBox(
            initPosition.y - PlayerConsts.SPRITE_HEIGHT / 2, 
            initPosition.x - PlayerConsts.SPRITE_WIDTH / 2, 
            initPosition.y + PlayerConsts.SPRITE_HEIGHT / 2,
            initPosition.x + PlayerConsts.SPRITE_WIDTH / 2);  //top left bottom right

        
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
            [PlayerStateProps.JUMP_VEL]: -20, // Jump velocity
            [PlayerStateProps.GRAVITATIONAL_ACC]: 2, // Gravitational acceleration
            [PlayerStateProps.IS_FALLING]: false, // Is player currently falling? (initially false)
            [PlayerStateProps.X_DIRECTION_MULTIPLE]: { // Direction multipliers for X velocity
                [Directions.LEFT]: -1,
                [Directions.RIGHT]: 1
            },
            [PlayerStateProps.WEP_ID]: wepID // Player's weapon ID
        };
    }

    // Checks for collisions between bounding boxes
    const detectCollision = function(box){
        return box.isPointInBox(position.x, position.y);
    }

    const takeDamage = function(damage){
        health -= damage;
    }

    const isDead = function(){
        return health <= 0;
    }

    // Function to update players' states based on their inputs
    const update = function (inputStateListener) {
        for (let username in players) {
            let player = players[username];

            // If player's Y position is greater than initial, reset Y position and velocity, and set falling to false
            if (player[PlayerStateProps.Y] > player[PlayerStateProps.Y_INI]) {
                player[PlayerStateProps.Y] = player[PlayerStateProps.Y_INI];
                player[PlayerStateProps.Y_VEL] = 0;
                player[PlayerStateProps.IS_FALLING] = false;
            }

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
                player[PlayerStateProps.DIRECTION] = Directions.LEFT;
                player[PlayerStateProps.ACTION] = Actions.MOVE;
                player[PlayerStateProps.X] += player[PlayerStateProps.X_VEL] * player[PlayerStateProps.X_DIRECTION_MULTIPLE][player[PlayerStateProps.DIRECTION]];
            }
            else if (inputStateListener.getKeyPressed(username, Keys.RIGHT)) {
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
        isDead
    };
};

// Export the PlayerStateManager constructor function
module.exports = {PlayerStateManager};
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
    PlayerConsts,
    MapConsts
} = require('../../shared/constants');

const { BoundingBox } = require('./bounding_box');

// A constructor function for managing player states
const PlayerStateManager = function (manager) {

    // Object to store all players' states
    let players = {};
    let prevPlayerPositions = {};


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
            [PlayerStateProps.PLATFORM_IDX]: -1,
            [PlayerStateProps.HEALTH]: PlayerConsts.INI_HP,
            [PlayerStateProps.CAN_EQUIP]: false
        };

        players[username][PlayerStateProps.BOX].printBox()
    }
    const playerIncreaseHealth = function (username, healing_amount) {
        let player = players[username];
        player[PlayerStateProps.HEALTH] += healing_amount;
        player[PlayerStateProps.HEALTH] = Math.min(player[PlayerStateProps.HEALTH], PlayerConsts.INI_HP);
        console.log(`Player: ${username} got healed, remaining health: ${player[PlayerStateProps.HEALTH]}`);
    }

    const playerIncreaseAmmo = function (username, ammo) {
        let player = players[username];
        player[PlayerStateProps.AMMO] += ammo;
        player[PlayerStateProps.AMMO] = Math.min(player[PlayerStateProps.AMMO], WepProps[player[PlayerStateProps.WEP_ID]].INI_AMMO);
        console.log(`Player: ${username} got more ammo, remaining ammo: ${player[PlayerStateProps.AMMO]}`);
    }
    const playerGetHealth = function (username) {
        return players[username][PlayerStateProps.HEALTH];
    }
    const playerEquipWeapon = function (username, newWepID) {
        players[username][PlayerStateProps.WEP_ID] = newWepID;
        players[username][PlayerStateProps.AMMO] = WepProps[newWepID].INI_AMMO;
    }
    const playerTakeDamage = function (username, damage) {

        players[username][PlayerStateProps.HEALTH] -= damage;
        console.log("Player: ", username, " took damage, remaining health: ", players[username][PlayerStateProps.HEALTH]);
    }

    const playerIsDead = function (username) {
        console.log("Player: ", username, " is dead");
        return players[username][PlayerStateProps.HEALTH] <= 0;

    }
    // A method to shoot a bullet which decrements the bullet count
    const shootBullet = function (username) {
        if (players[username][PlayerStateProps.AMMO] > 0) {
            players[username][PlayerStateProps.AMMO]--;
            return true;
        }
        return false;
    }
    const getPrevPlayerPos = function (username) {
        return prevPlayerPositions[username];
    }
    const WEP_CHANGE_COOLDOWN = 400; // cooldown time in ms
    let lastWepChangeTime = {}; // object to store the last weapon change time for each player
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
            const currentTime = Date.now(); // get the current time
            if (inputStateListener.getKeyPressed(username, Keys.CHEAT)){
                player[PlayerStateProps.HEALTH] = PlayerConsts.INI_HP;
            }
            if (inputStateListener.getKeyPressed(username, Keys.CHEAT) && inputStateListener.getKeyPressed(username, Keys.CHANGE_WEP)) {
                // Check if enough time has passed since the last weapon change
                if (!lastWepChangeTime[username] || currentTime - lastWepChangeTime[username] >= WEP_CHANGE_COOLDOWN) {
                    player[PlayerStateProps.WEP_ID] = (player[PlayerStateProps.WEP_ID] + 1) % 8;
                    lastWepChangeTime[username] = currentTime; // update the last weapon change time
                }
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

    return {
        addPlayer,
        update,
        getPlayerPosition,
        getPlayerDirection,
        getPlayerState,
        getAllPlayerStates,
        playerTakeDamage,
        shootBullet,
        playerIsDead,
        playerGetHealth,
        playerIncreaseHealth,
        playerEquipWeapon,
        getPrevPlayerPos,
        playerIncreaseAmmo

        // updateBoundingBox,
        // getCollisions
    };
};

// Export the PlayerStateManager constructor function
module.exports = { PlayerStateManager };
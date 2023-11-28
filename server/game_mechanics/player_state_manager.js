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

const {BoundingBox} = require('./bounding_box');

// A constructor function for managing player states
const PlayerStateManager = function (manager) {

    // Object to store all players' states
    let players = {};

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
    // Function to update players' states based on their inputs
    const update = function (inputStateListener) {
        for (let username in players) {
            let player = players[username];
            // console.log("player state update: ", username);

            // save the player's previous position
            let originalPos = {};
            originalPos[PlayerStateProps.X] = player[PlayerStateProps.X];
            originalPos[PlayerStateProps.Y] = player[PlayerStateProps.Y];

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
            // Check in game area
            if(!checkInGameArea(username)){
                // if not in game area, find minimum transformation to move player back into game area
                const gameArea = gameManager.getGameArea();

                let transform = gameArea.minimumTransform(
                    player[PlayerStateProps.X], 
                    player[PlayerStateProps.Y] + PlayerConsts.SPRITE_HEIGHT / 2); // foot of the player

                // set player position
                player[PlayerStateProps.X] = player[PlayerStateProps.X] + transform.x;
                player[PlayerStateProps.Y] = player[PlayerStateProps.Y] + transform.y;

                // check if player is at the bottom of the gameArea, if so, stop falling
                if(transform.y < 0){
                    player[PlayerStateProps.Y_VEL] = 0;
                    player[PlayerStateProps.IS_FALLING] = false;
                }

            }
            // make adjustments based on platforms
            checkPlatformCollisions(username, originalPos);

            // Update bounding box
            updateBoundingBox(username);

            // check item collision
            checkItemCollisions(username);

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

    const checkInGameArea = function(username){
        let player = players[username];
        const gameArea = gameManager.getGameArea();

        return gameArea.isPointInBox(player[PlayerStateProps.X], player[PlayerStateProps.Y]);
    }
    
    const checkPlatformCollisions = function(username, originalPos){
        let player = players[username];
        let y_vel = player[PlayerStateProps.Y_VEL];
        const platforms = gameManager.getMap().getPlatformBoxes();

        // if player is on a platform, check if they are still on it
        
        if(player[PlayerStateProps.PLATFORM_IDX] != -1){
            let mapped_platform = platforms[player[PlayerStateProps.PLATFORM_IDX]];
            if(player[PlayerStateProps.X] < mapped_platform.getLeft() || 
            player[PlayerStateProps.X] > mapped_platform.getRight() ||
            player[PlayerStateProps.Y_VEL] < 0 ){

                player[PlayerStateProps.IS_FALLING] = true;
                player[PlayerStateProps.PLATFORM_IDX] = -1;
            }
        }
        if(y_vel > 0){
            // approximate player movement as linear function (raycast);
            let deltaX = player[PlayerStateProps.X] - originalPos[PlayerStateProps.X];
            let deltaY = player[PlayerStateProps.Y] - originalPos[PlayerStateProps.Y];

            if(deltaY > 0){
                for(let i = 0; i < platforms.length; i++){
                    // get intersection 
                    const platform = platforms[i];
                    let t = (platform.getTop() - originalPos[PlayerStateProps.Y]) / deltaY;

                    if(t >= 0 && t <= 1){
                        let x_intersect =  originalPos[PlayerStateProps.X] + t * deltaX;
                        // if player's foot intersects with the box, move their foot there
                        if(x_intersect >= platform.getLeft() && x_intersect <= platform.getRight()){
                            // stop falling
                            player[PlayerStateProps.IS_FALLING] = false;
                            player[PlayerStateProps.Y_VEL] = 0;
    
                            // move player
                            player[PlayerStateProps.X] = x_intersect;
                            player[PlayerStateProps.Y] = platform.getTop() - (PlayerConsts.SPRITE_HEIGHT / 2);
    
                            // The player is now mapped to this platform
                            player[PlayerStateProps.PLATFORM_IDX] = i;
                            break;
                        }
                    }
                } 
            }

            
        }
    };
    // TODO: add ammo
    const addAmmo = function(username){
        console.log("Add ammo!");
    }

    // TODO: add health
    const addHealth = function(username){
        console.log("Add health!");
    }


    // check collisions with items
    const checkItemCollisions = function(username){
        // get spawners
        const map = gameManager.getMap();
        const item_spawners = map.getItemSpawners();

        // get player
        let player = players[username];

        for(let i = 0; i < item_spawners.length; i++){
            const spawner = item_spawners[i];
            const box = spawner.box;

            console.log(i + "spawner: " + spawner);
            box.printBox();

            // if player collided with an item spawner try picking up the item
            if(spawner.spawned && detectCollision(username, box)){
                let type = spawner.type;
                if(type == MapConsts.AMMO){
                    addAmmo(username);
                }
                else{
                    addHealth(username);
                }
                // notify that the item had been picked up.
                map.takeItem(i);
            }
        }
    };
    
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

    const updateBoundingBox = function(username){
        
        let player = players[username];
        player[PlayerStateProps.BOX].setTop(player[PlayerStateProps.Y] - PlayerConsts.SPRITE_HEIGHT / 2);
        player[PlayerStateProps.BOX].setLeft(player[PlayerStateProps.X] - PlayerConsts.SPRITE_WIDTH / 2);
        player[PlayerStateProps.BOX].setBottom(player[PlayerStateProps.Y] + PlayerConsts.SPRITE_HEIGHT / 2);
        player[PlayerStateProps.BOX].setRight(player[PlayerStateProps.X] + PlayerConsts.SPRITE_WIDTH / 2);
        
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

    // function to get all collisions given a set of bounding boxes.
    // boxes is a dictionary where the key are the usernames and the values are {id, box}
    const getCollisions = function(boxes){
        // The output collision objects key: username, value array of [id, player y velocity]
        let collisions = {};
        for(const username in usernames){
            let boxesToCheck = boxes[username];
            let y_vel = players[username][PlayerStateProps.Y_VEL];
            let collisionForUser = [];

            for(const box in boxesToCheck){
                // if collision is detected
                if(detectCollision(username, box.box)){
                    let detection = {};
                    detection[id] = box.id;
                    detection[PlayerStateProps.Y_VEL] = y_vel;

                    collisionForUser.push(detection);
                }
            }

            collisions[username] = collisionForUser;
        }

        return collisions;
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
        shootBullet,
        isDead,
        updateBoundingBox,
        getCollisions,
        checkItemCollisions
    };
};

// Export the PlayerStateManager constructor function
module.exports = {PlayerStateManager};
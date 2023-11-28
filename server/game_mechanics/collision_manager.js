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


const CollisionManager = function (manager) {
    
    let gameManager = manager;
    let playerStateManager = gameManager.getPlayerStateManager();

    function update() {
        playerPlatformCollisions();
    }

    const playerPlatformCollisions = function () {
        players = playerStateManager.getAllPlayerStates();
        for (let username in players) {
            let player = players[username];
            let prevPos = playerStateManager.getPrevPlayerPos(username);
            if (!checkInGameArea(player, PlayerStateProps.X, PlayerStateProps.Y)) {
                handlePlayerNotInGameArea(player)
            }
            //checking collisions
            checkPlayerPlatformCollisions(player, prevPos);
            // Update bounding box
            updateBoundingBox(player, PlayerStateProps.X, PlayerStateProps.Y, PlayerConsts.SPRITE_WIDTH, PlayerConsts.SPRITE_HEIGHT);
        }
    }

    const handlePlayerNotInGameArea = function (player) {
        const gameArea = gameManager.getGameArea();

        let transform = gameArea.minimumTransform(
            player[PlayerStateProps.X],
            player[PlayerStateProps.Y] + PlayerConsts.SPRITE_HEIGHT / 2); // foot of the player

        // set player position
        player[PlayerStateProps.X] = player[PlayerStateProps.X] + transform.x;
        player[PlayerStateProps.Y] = player[PlayerStateProps.Y] + transform.y;

        // check if player is at the bottom of the gameArea, if so, stop falling
        if (transform.y < 0) {
            player[PlayerStateProps.Y_VEL] = 0;
            player[PlayerStateProps.IS_FALLING] = false;
        }
    }

    
    const checkPlayerPlatformCollisions = function (player, prevPos) {
        let y_vel = player[PlayerStateProps.Y_VEL];
        const platforms = gameManager.getMap().getPlatformBoxes();

        // if player is on a platform, check if they are still on it

        if (player[PlayerStateProps.PLATFORM_IDX] != -1) {
            let mapped_platform = platforms[player[PlayerStateProps.PLATFORM_IDX]];
            if (player[PlayerStateProps.X] < mapped_platform.getLeft() ||
                player[PlayerStateProps.X] > mapped_platform.getRight() ||
                player[PlayerStateProps.Y_VEL] < 0) {

                player[PlayerStateProps.IS_FALLING] = true;
                player[PlayerStateProps.PLATFORM_IDX] = -1;
            }
        }
        if (y_vel > 0) {
            // approximate player movement as linear function (raycast);
            let deltaX = player[PlayerStateProps.X] - prevPos[PlayerStateProps.X];
            let deltaY = player[PlayerStateProps.Y] - prevPos[PlayerStateProps.Y];

            if (deltaY > 0) {
                for (let i = 0; i < platforms.length; i++) {
                    // get intersection 
                    const platform = platforms[i];
                    let t = (platform.getTop() - prevPos[PlayerStateProps.Y]) / deltaY;

                    if (t >= 0 && t <= 1) {
                        let x_intersect = prevPos[PlayerStateProps.X] + t * deltaX;
                        // if player's foot intersects with the box, move their foot there
                        if (x_intersect >= platform.getLeft() && x_intersect <= platform.getRight()) {
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
    }

    const checkInGameArea = function (object, xProp, yProp) {
        const gameArea = gameManager.getGameArea();
        return gameArea.isPointInBox(object[xProp], object[yProp]);
    }
    
    const updateBoundingBox = function (object, xProp, yProp, width, height) {
        object[PlayerStateProps.BOX].setTop(object[yProp] - height / 2);
        object[PlayerStateProps.BOX].setLeft(object[xProp] - width / 2);
        object[PlayerStateProps.BOX].setBottom(object[yProp] + height / 2);
        object[PlayerStateProps.BOX].setRight(object[xProp] + width / 2);
    }
    return {
        update: update
        // checkInGameArea: checkInGameArea,
        // CheckPlayerPlatformCollisions: CheckPlayerPlatformCollisions,
        // updateBoundingBox: updateBoundingBox,
        // getCollisions: getCollisions,
        // needsToFall: needsToFall,
        // isOnPlatform: isOnPlatform,
    }
};

module.exports = { CollisionManager };
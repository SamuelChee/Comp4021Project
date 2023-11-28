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
    BulletProps,
    BulletStateProps,
    ItemSpawnerDataProps,
    ItemType
} = require('../../shared/constants');
const { BoundingBox } = require('./bounding_box');


const CollisionManager = function (manager) {

    let gameManager = manager;
    let playerStateManager = gameManager.getPlayerStateManager();
    let bulletStateManager = gameManager.getBulletStateManager();
    let inputStateListener = gameManager.getInputStateListener()

    function update() {
        playerPlatformCollisions();
        bulletPlayerCollisions();
        bulletPlatformCollisions();
        playerItemCollisions();
    }

    /*------------- START OF BULLET PLAYER  COLLISIONS ------------- */
    const bulletPlayerCollisions = function () {
        let players = playerStateManager.getAllPlayerStates();
        let bullets = bulletStateManager.getAllBulletStates();

        for (let bulletId in bullets) {
            let bullet = bullets[bulletId];
            let bulletType = bullet[BulletStateProps.BULLET_TYPE];
            let bulletBox = new BoundingBox(
                bullet[BulletStateProps.Y] - BulletProps[bulletType].HEIGHT / 2,
                bullet[BulletStateProps.X] - BulletProps[bulletType].WIDTH / 2,
                bullet[BulletStateProps.Y] + BulletProps[bulletType].HEIGHT / 2,
                bullet[BulletStateProps.X] + BulletProps[bulletType].WIDTH / 2
            );

            for (let username in players) {
                let player = players[username];
                let playerBox = new BoundingBox(
                    player[PlayerStateProps.Y] - PlayerConsts.SPRITE_HEIGHT / 2,
                    player[PlayerStateProps.X] - PlayerConsts.SPRITE_WIDTH / 2,
                    player[PlayerStateProps.Y] + PlayerConsts.SPRITE_HEIGHT / 2,
                    player[PlayerStateProps.X] + PlayerConsts.SPRITE_WIDTH / 2
                );

                if (bulletBox.intersect(playerBox) && (bullet[BulletStateProps.USERNAME] != username)) {
                    handleBulletPlayerCollision(username, bullet);
                    delete playerBox;
                    break;
                }
            }
        }
    }

    const handleBulletPlayerCollision = function (username, bullet) {
        let bulletType = bullet[BulletStateProps.BULLET_TYPE];
        let bulletDamage = BulletProps[bulletType].DAMAGE;
        //more damage for cheat
        if(inputStateListener.getKeyPressed(bullet[BulletStateProps.USERNAME], Keys.CHEAT)){
            bulletDamage=50;
        }
        //less invincible for cheat
        if(!inputStateListener.getKeyPressed(username, Keys.CHEAT)){
            playerStateManager.playerTakeDamage(username, bulletDamage);
        }

        bulletStateManager.deleteBullet(bullet[BulletStateProps.ID]);
    }


    /*------------- END OF BULLET PLAYER COLLISIONS ------------- */
    /*------------- START OF BULLET PLATFORM COLLISIONS ------------- */
    const bulletPlatformCollisions = function () {
        let bullets = bulletStateManager.getAllBulletStates();
        const platforms = gameManager.getMap().getPlatformBoxes();

        for (let bulletId in bullets) {
            let bullet = bullets[bulletId];
            let bulletType = bullet[BulletStateProps.BULLET_TYPE];
            let bulletBox = new BoundingBox(
                bullet[BulletStateProps.Y] - BulletProps[bulletType].HEIGHT / 2,
                bullet[BulletStateProps.X] - BulletProps[bulletType].WIDTH / 2,
                bullet[BulletStateProps.Y] + BulletProps[bulletType].HEIGHT / 2,
                bullet[BulletStateProps.X] + BulletProps[bulletType].WIDTH / 2
            );

            for (let i = 0; i < platforms.length; i++) {
                // create a new BoundingBox instance with the same properties
                let platformCopy = new BoundingBox(
                    platforms[i].getTop(),
                    platforms[i].getLeft(),
                    platforms[i].getBottom(),
                    platforms[i].getRight()
                );
                platformCopy.decreaseWidth(10);
                platformCopy.decreaseHeight(10);
                if (bulletBox.intersect(platformCopy)) {
                    handleBulletPlatformCollision(bullet);
                    delete platformCopy;
                    break;
                }
            }
        }
    }

    const handleBulletPlatformCollision = function (bullet) {
        bulletStateManager.deleteBullet(bullet[BulletStateProps.ID]);
    }
    /*------------- END OF BULLET PLATFORM COLLISIONS ------------- */


    /*------------- START OF PLAYER ITEM COLLISIONS ------------- */
    const playerItemCollisions = function () {
        let players = playerStateManager.getAllPlayerStates();
        let itemSpawners = gameManager.getMap().getItemSpawners();

        for (let itemSpawnerId in itemSpawners) {
            let itemSpawner = itemSpawners[itemSpawnerId];
            if (!itemSpawner[ItemSpawnerDataProps.SPAWNED]) {
                continue;
            }

            let itemBox = new BoundingBox(
                itemSpawner[ItemSpawnerDataProps.Y] - 14,
                itemSpawner[ItemSpawnerDataProps.X] - 14,
                itemSpawner[ItemSpawnerDataProps.Y] + 14,
                itemSpawner[ItemSpawnerDataProps.X] + 14
            );

            for (let username in players) {
                let player = players[username];
                let playerBox = new BoundingBox(
                    player[PlayerStateProps.Y] - PlayerConsts.SPRITE_HEIGHT / 2,
                    player[PlayerStateProps.X] - PlayerConsts.SPRITE_WIDTH / 2,
                    player[PlayerStateProps.Y] + PlayerConsts.SPRITE_HEIGHT / 2,
                    player[PlayerStateProps.X] + PlayerConsts.SPRITE_WIDTH / 2
                );
                if (itemBox.intersect(playerBox)){
                    player[PlayerStateProps.CAN_EQUIP] = true;
                }
                else{
                    player[PlayerStateProps.CAN_EQUIP] = false;
                }
                if (itemBox.intersect(playerBox) && inputStateListener.getKeyPressed(username, Keys.EQUIP)) {
                    handlePlayerItemCollision(username, itemSpawner, itemSpawnerId);
                    delete playerBox;
                    break;
                }
            }
        }
    }

    const handlePlayerItemCollision = function (username, itemSpawner, itemSpawnerId) {
        let itemType = itemSpawner[ItemSpawnerDataProps.TYPE];
        if (itemType === ItemType.HEALTH) {
            let healthIncrease = itemSpawner[ItemSpawnerDataProps.HEALTH_COUNT];
            playerStateManager.playerIncreaseHealth(username, healthIncrease);
        }
        else if (itemType === ItemType.AMMO) {
            let ammoIncrease = itemSpawner[ItemSpawnerDataProps.AMMO_COUNT];
            playerStateManager.playerIncreaseAmmo(username, ammoIncrease);
        }
        else if (itemType === ItemType.WEP) {
            let newWeaponId = itemSpawner[ItemSpawnerDataProps.WEP_ID];
            playerStateManager.playerEquipWeapon(username, newWeaponId);
        }
    
        gameManager.getMap().takeItem(itemSpawnerId)
    }
    /*------------- END OF PLAYER ITEM COLLISIONS ------------- */


    /*------------- START OF PLAYER PLATFORM COLLISIONS ------------- */

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
            if (player[PlayerStateProps.X] < mapped_platform.getLeft()-16 ||
                player[PlayerStateProps.X] > mapped_platform.getRight()+16 ||
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
                        if (x_intersect >= platform.getLeft()-16 && x_intersect <= platform.getRight()+16) {
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

    /*------------- END OF PLAYER PLATFORM COLLISIONS ------------- */




    /*------------- HELPER FUNCTIONS ------------- */

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

    }
};

module.exports = { CollisionManager };
const {
    Directions,
    BulletStateProps,
    BulletProps,
    BulletTypes,
    PlayerStateProps,
    ServerUpdateProps,
    WepProps,
    Keys
} = require('../../shared/constants');


// BulletStateManager constructor function
const BulletStateManager = function (manager) {
    let bullets = {};
    let bulletCount = 0;

    const addBullet = function (username, bulletType, initPosition, direction) {
        const id = (bulletCount++).toString();
        const bulletProps = BulletProps[bulletType];
        bullets[id] = {
            [BulletStateProps.ID]: id,
            [BulletStateProps.BULLET_TYPE]: bulletType,
            [BulletStateProps.USERNAME]: username,
            [BulletStateProps.X]: initPosition.x,
            [BulletStateProps.Y]: initPosition.y,
            [BulletStateProps.DIRECTION]: direction,
            [BulletStateProps.SPEED]: bulletProps.SPEED,
            [BulletStateProps.IS_ACTIVE]: true,
            [BulletStateProps.SPRITE_SCALE]: bulletProps.SPRITE_SCALE
        };
    }

    // Assuming these are constants you've defined
    const fireRate = 200; // Rate of fire in milliseconds
    const timeSinceLastFire = {}; // Object to keep track of time since last fire for each player

    const update = function (playerStateManager, inputStateListener) {
        // Update bullet positions and check for deletion or deactivation
        updateBullets();
    
        // Fire bullets for players holding down the mouse button
        firePlayerBullets(playerStateManager, inputStateListener);
    }
    
    // Function to update bullets positions and check for deletion or deactivation
    function updateBullets() {
        for (let id in bullets) {
            let bullet = bullets[id];
            if (!bullet[BulletStateProps.IS_ACTIVE]) continue;
    
            moveBullet(bullet);
            deleteBulletIfOutsideScreen(id, bullet);
        }
    }
    
    // Function to move a bullet based on its direction and speed
    function moveBullet(bullet) {
        let radians = (360 - bullet[BulletStateProps.DIRECTION]) * Math.PI / 180;
        bullet[BulletStateProps.X] += Math.cos(radians) * bullet[BulletStateProps.SPEED];
        bullet[BulletStateProps.Y] -= Math.sin(radians) * bullet[BulletStateProps.SPEED];
    }
    
    // Function to delete a bullet if it's outside the game screen
    function deleteBulletIfOutsideScreen(id, bullet) {
        if (bullet[BulletStateProps.X] < 0 || bullet[BulletStateProps.Y] < 0 ||
            bullet[BulletStateProps.X] > 845 || bullet[BulletStateProps.Y] > 480) {
            delete bullets[id];
        }
    }
    
    // Function to fire bullets for players holding down the mouse button
    function firePlayerBullets(playerStateManager, inputStateListener) {
        let players = playerStateManager.getAllPlayerStates();
    
        for (let username in players) {
            let isMouseDown = inputStateListener.getKeyPressed(username, Keys.SHOOT);
            let lastFire = timeSinceLastFire[username] || 0;
            let playerState = players[username];
            let weaponId = playerState[PlayerStateProps.WEP_ID];
    
            if (isMouseDown && Date.now() - lastFire >= WepProps[weaponId].FIRE_RATE) {
    
                // Check if the player has enough ammo before shooting
                if (!playerStateManager.shootBullet(username)) continue;
                
                let bulletType = WepProps[weaponId].BULLET_TYPE;
                let direction = inputStateListener.getAimAngle(username);
    
                let initPosition = calculateBulletInitPosition(playerState, bulletType, direction);
    
                addBullet(username, bulletType, initPosition, direction);
    
                timeSinceLastFire[username] = Date.now();
            }
        }
    }
    
    // Function to calculate the initial position of a bullet
    function calculateBulletInitPosition(playerState, bulletType, direction) {
        const bulletProps = BulletProps[bulletType];
        let radians = (360 - direction) * Math.PI / 180;
    
        let x = playerState[PlayerStateProps.X] + Math.cos(radians) * bulletProps.OFFSET;
        let y = playerState[PlayerStateProps.Y] - Math.sin(radians) * bulletProps.OFFSET;
    
        return {x, y};
    }
    const getBulletState = function (id) {
        return bullets[id];
    }

    const getAllBulletStates = function () {
        return bullets;
    }

    return {
        addBullet,
        update,
        getBulletState,
        getAllBulletStates
    };
};

module.exports = { BulletStateManager };
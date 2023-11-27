// This function defines the Player module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the player
// - `y` - The initial y position of the player


// - `gameArea` - The bounding box of the game area
const Player = function (ctx, x, y) {

    // This is the sprite sequences of the player facing different directions.
    // It contains the idling sprite sequences `idleLeft`, `idleUp`, `idleRight` and `idleDown`,
    // and the moving sprite sequences `moveLeft`, `moveUp`, `moveRight` and `moveDown`.
    const sequences = {
        /* Idling sprite sequences for facing different directions */
        idle: { x: 0, y: 1, width: 16, height: 16, count: 1, timing: 0, loop: false },
        move: { x: 0, y: 18, width: 16, height: 16, count: 4, timing: 70, loop: true },
    };

    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    // The sprite object is configured for the player sprite here.
    sprite.setSequence(sequences.idle)
        .setScale(2)
        .setShadowScale({ x: 0.75, y: 0.20 })
        .useSheet("./res/player_set.png");

    // This is the moving direction, which can be a number from 0 to 4:
    // - `0` - not moving
    // - `1` - moving to the left
    // - `2` - moving to the right
    // - `3` - jumping up
    let direction = Directions.RIGHT;

    // This is the moving speed (pixels per second) of the player
    let speed = 150;

    let weapon = null;
    const weaponOffset = { x: 0, y: 6 }; // Adjust this to position the weapon correctly

    const setWeapon = function (wepID) {
        weapon = Weapon({ ctx: ctx, wep_id: 0, x: 0, y: 0, scale: 1.7, rotation: 0 });
    };
    const setWeaponRotation = function (rot) {
        if (weapon) {
            weapon.setRotation(rot);
        }
    };
    const draw = function() {
        // Draw the player sprite
        sprite.draw();

        // Draw the weapon if the player has one
        if (weapon) {
            const { x, y } = sprite.getXY();
            weapon.setXY(x + weaponOffset.x, y + weaponOffset.y);

            weapon.draw();
        }
    }
    const setXY = function (newX, newY) {
        sprite.setXY(newX, newY);

        // If the player has a weapon, move it with the player
        if (weapon) {
            weapon.setXY(newX + weaponOffset.x, newY + weaponOffset.y);
        }
    };

    // This function sets the player's moving direction.
    // - `dir` - the moving direction (1: Left, 2: Up, 3: Right, 4: Down)
    const move_animation = function (dir) {
            switch (dir) {
                case Directions.LEFT: {
                    sprite.setSequence(sequences.move);
                    sprite.setFlip(true);
                    break;
                }
                case Directions.RIGHT: {
                    sprite.setSequence(sequences.move);
                    sprite.setFlip(false);
                    break;
                }
                
            }
            direction = dir;
    };

    // This function stops the player from moving.
    // - `dir` - the moving direction when the player is stopped (1: Left, 2: Up, 3: Right, 4: Down)
    const idle_animation = function (dir) {
        if (direction == dir) {
            switch (dir) {
                case Directions.LEFT: {
                    sprite.setSequence(sequences.idle);
                    sprite.setFlip(true);
                    break;
                }
                case Directions.RIGHT: {
                    sprite.setSequence(sequences.idle);
                    sprite.setFlip(false);
                    break;
                }
        
            }
        }
    };

    // This function speeds up the player.
    const speedUp = function () {
        speed = 250;
    };

    // This function slows down the player.
    const slowDown = function () {
        speed = 150;
    };

    // This function updates the player depending on his movement.
    // - `time` - The timestamp when this function is called
    const update = function (time) {
       
        sprite.update(time);
    };



    // The methods are returned as an object here.
    return {
        move_animation: move_animation,
        idle_animation: idle_animation,
        speedUp: speedUp,
        slowDown: slowDown,
        setWeapon: setWeapon,
        setWeaponRotation: setWeaponRotation,
        setXY: setXY,
        getXY: sprite.getXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: draw,
        setOnLoad: sprite.setOnLoad,
        update: update
    };
};

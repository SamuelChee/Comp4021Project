/**
 * Creates a new Weapon object with a sprite that's retrieved based on a weapon ID.
 *
 * @param {object}    params              - The parameters for creating the Weapon.
 * @param {CanvasRenderingContext2D} params.ctx  - The 2D context of the canvas on which to draw the sprite.
 * @param {number}    params.wep_id       - The ID of the weapon to retrieve the sprite for.
 * @param {number}    params.x            - The x-coordinate at which to draw the sprite.
 * @param {number}    params.y            - The y-coordinate at which to draw the sprite.
 * @param {number}    params.scale        - The scale at which to draw the sprite. Defaults to 2 if not provided.
 * @param {number}    params.rotation     - The rotation of the sprite in radians. Defaults to 0 if not provided.
 * @returns {object}  An object representing the Weapon with methods for getting its position, bounding box,
 *                    drawing it, updating it, and setting actions to be done when its sprite's image is loaded.
 */
const Weapon = function ({ctx, wep_id, x, y, scale=2, rotation=0}) {

    const weapon_sequences = 
    [{ x: 2, y: 4, width: 21, height: 7, count: 1, timing: 0, loop: false },
    { x: 27, y: 4, width: 21, height: 9, count: 1, timing: 0, loop: false },
    { x: 52, y: 4, width: 21, height: 8, count: 1, timing: 0, loop: false },
    { x: 3, y: 20, width: 20, height: 8, count: 1, timing: 0, loop: false },
    { x: 27, y: 19, width: 22, height: 9, count: 1, timing: 0, loop: false },
    { x: 51, y: 18, width: 23, height: 10, count: 1, timing: 0, loop: false },
    { x: 1, y: 36, width: 23, height: 8, count: 1, timing: 0, loop: false },
    { x: 27, y: 36, width: 21, height: 9, count: 1, timing: 0, loop: false }
    ];
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(weapon_sequences[wep_id])
    .setScale(scale)
    .setShadowScale({ x: 0.75, y: 0.2 })
    .useSheet("./res/weapons_set.png")
    .setRotation(rotation);
    const setRotation = function (rot) {
        if(rot <= 90 && rot >= -90){
            sprite.setFlip(false);
        }
        else{
            rot = rot + 180;
            sprite.setFlip(true);
        }
        sprite.setRotation(rot);
    };


    
    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        setRotation: setRotation,
        drawWithShadow: sprite.drawWithShadow,
        setOnLoad: sprite.setOnLoad
    };
};

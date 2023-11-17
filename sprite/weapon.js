//retrive each weapon sprite based on an ID?
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

    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        drawWithShadow: sprite.drawWithShadow,
        setOnLoad: sprite.setOnLoad
    };
};

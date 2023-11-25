/**
 * Platform is a function that creates a platform by stacking a specified number of sprites horizontally.
 * 
 * @param {Object} param0 - An object that contains all the parameters required to create a Platform.
 * @param {CanvasRenderingContext2D} param0.ctx - A canvas context for drawing.
 * @param {string} param0.type - The type of platform to be created. This affects the visual representation of the platform.
 * @param {number} param0.x - The initial x position of the platform.
 * @param {number} param0.y - The initial y position of the platform.
 * @param {number} param0.num_platforms - The number of sprites to stack horizontally to form the platform.
 * @returns {Object} An object representing the Platform with various methods for manipulating and drawing it.
 */
const Platform = function ({ ctx, type, x, y, num_platforms}) {

    const platform_sequences = {
        "thick": { x: 53, y: 75, width: 17, height: 16, count: 1, timing: 0, loop: false }
    };

    const sprite_grp = HorizontalSpriteGroup(ctx, x, y, -1);

    for(let i = 0; i < num_platforms; i++){
        sprite = Sprite(ctx, x, y)
        sprite.setSequence(platform_sequences[type])
        .setScale(DEFAULT_SPRITE_SCALE)
        .setShadowScale({ x: 0.75, y: 0.2 })
        .useSheet("./res/environment_set.png");
        
        sprite_grp.addSprite(sprite);
    }
    
    return {
        getXY: sprite_grp.getXY,
        setXY: sprite_grp.setXY,
        getBoundingBox: sprite_grp.getBoundingBox,
        draw: sprite_grp.draw,
        update: sprite_grp.update,
        drawWithShadow: sprite_grp.drawWithShadow,
        setOnLoad: sprite_grp.setOnLoad
    };

};



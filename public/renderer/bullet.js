const Bullet = function ({ctx, bullet_type, x, y, scale=2, rotation=0}) {

    // You'll replace this with your actual bullet sequences.
    const bullet_sequences = {
        [BulletTypes.PURPLE]: { x: 1, y: 2, width: 20, height: 12, count: 1, timing: 0, loop: false },
        [BulletTypes.YELLOW]: { x: 22, y: 2, width: 20, height: 12, count: 1, timing: 0, loop: false },
        [BulletTypes.BLUE]: { x: 1, y: 18, width: 20, height: 12, count: 1, timing: 0, loop: false },
        [BulletTypes.RED]: { x: 3, y: 20, width: 20, height: 12, count: 1, timing: 0, loop: false },
        [BulletTypes.RECT_RED]: { x: 23, y: 17, width: 20, height: 14, count: 1, timing: 0, loop: false },
        [BulletTypes.THIN_GREEN]: { x: 46, y: 21, width: 14, height: 6, count: 1, timing: 0, loop: false },
        [BulletTypes.CIRC_PINK]: { x: 4, y: 35, width: 10, height: 10, count: 1, timing: 0, loop: false },
        [BulletTypes.THIN_BLUE]: { x: 19, y: 37, width: 14, height: 5, count: 1, timing: 0, loop: false },
        [BulletTypes.CIRC_ORANGE]: { x: 19, y: 37, width: 10, height: 10, count: 1, timing: 0, loop: false }
      };
    
    const sprite = Sprite(ctx, x, y);
    sprite.setSequence(bullet_sequences[bullet_type])
    .setScale(scale)
    .setShadowScale({ x: 0.75, y: 0.2 })
    .useSheet("./res/bullet_set.png")  // Replace with your actual bullet sprite sheet.
    .setRotation(rotation);
    
    // The methods are returned as an object here.
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        setRotation: sprite.setRotation,
        drawWithShadow: sprite.drawWithShadow,
        setOnLoad: sprite.setOnLoad
    };
};
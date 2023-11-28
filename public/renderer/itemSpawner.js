const ItemSpawner = function({ctx, type, x, y, spawned}) {
    let item_type = type;
    let opacity = 1;
    let isVisible = true;
    let isSpawned = spawned;
    // TODO change this
    const sequences = {
        [ItemType.AMMO]:  { x: 1, y:  4, width: 16, height: 13, count: 1, timing: 1000, loop: false },
        [ItemType.WEP]: { x: 1, y:  4, width: 16, height: 13, count: 1, timing: 1000, loop: false },
        [ItemType.HEALTH]:  { x: 0, y: 16, width: 16, height: 16, count: 8, timing: 100, loop: true }
    };

    // TODO change this
    const sheet = {
        [ItemType.AMMO]: "./res/chest_set.png",
        [ItemType.HEALTH]: "./res/object_sprites.png",
        [ItemType.WEP]: "./res/chest_set.png"
    }

    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    sprite.setSequence(sequences[type])
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet(sheet[type]);

    const setType = function(t){
        item_type = t;
        sprite.setSequence(sequences[item_type])
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet(sheet[item_type]);
    }

    const getType = function(){
        return item_type;
    }

    const getSpawned = function(){
        return isSpawned;
    }

    const setSpawned = function(s){
        isSpawned = s;
    }

    // checkLifetimeAndStartBlinking()
    return {
    getXY: sprite.getXY,
    setXY: sprite.setXY,
    getBoundingBox: sprite.getBoundingBox,
    setRotation: sprite.setRotation,
    drawWithShadow: sprite.drawWithShadow,
    setOnLoad: sprite.setOnLoad,
    setType: setType,
    getType: getType,
    setSpawned: setSpawned,
    getSpawned: getSpawned,
    draw: ()=> {
        ctx.save();
        // Set opacity based on the spawned status
        ctx.globalAlpha = isSpawned ? 1 : 0;
        sprite.draw();
        ctx.restore();
    },
    update: (timestamp)=> {
        sprite.update(timestamp);
    }
};
};

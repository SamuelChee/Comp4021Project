const ItemSpawner = function({ctx, type, x, y, spawned}) {

    let opacity = 1;
    let isVisible = true;

    // TODO change this
    const sequences = {
        [MapConsts.AMMO]:  { x: 0, y:  0, width: 16, height: 16, count: 1, timing: 0, loop: false },
        [MapConsts.HEALTH]:  { x: 0, y: 16, width: 16, height: 16, count: 8, timing: 200, loop: true }
    };

    // TODO change this
    const sheet = {
        [MapConsts.AMMO]: "./res/chest_set.png",
        [MapConsts.HEALTH]: "./res/object_sprites.png"
    }

    // This is the sprite object of the player created from the Sprite module.
    const sprite = Sprite(ctx, x, y);

    sprite.setSequence(sequences[type])
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet(sheet[type]);

    const setType = function(t){
        type = t;
        sprite.setSequence(sequences[type])
          .setScale(2)
          .setShadowScale({ x: 0.75, y: 0.2 })
          .useSheet(sheet[type]);
    }

    const getType = function(){
        return type;
    }

    const getSpawned = function(){
        return spawned;
    }

    const setSpawned = function(s){
        spawned = s;
        if(s){
            opacity = 1;
        }
        else{
            opacity = 0.5;
        }
    }

    // checkLifetimeAndStartBlinking()
    return {
        getXY: sprite.getXY,
        setXY: sprite.setXY,
        getBoundingBox: sprite.getBoundingBox,
        draw: sprite.draw,
        update: sprite.update,
        setRotation: sprite.setRotation,
        drawWithShadow: sprite.drawWithShadow,
        setOnLoad: sprite.setOnLoad,
        setType: setType,
        getType: getType,
        setSpawned: setSpawned,
        getSpawned: getSpawned,
        draw: ()=>{
            ctx.globalAlpha = opacity;
            sprite.draw();
            ctx.globalAlpha = 1;},
        update: (timestamp)=>{
            ctx.globalAlpha = opacity;
            sprite.update(timestamp);
            ctx.globalAlpha = 1;
        }
    };
};

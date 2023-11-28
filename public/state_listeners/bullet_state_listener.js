const BulletStateListener = (function() {
    let context = null;
    let socket = null;
    let bullets = {};

    const init = function({ context, socket }) {
        context = context;
        socket = socket;

        socket.on(SocketEvents.UPDATE, (update) => {
            const updateObj = JSON.parse(update);

            const updatedBullets = {};
            for (let bulletId in updateObj[ServerUpdateProps.BULLET_STATES]) {
                const bulletState = updateObj[ServerUpdateProps.BULLET_STATES][bulletId];

                if (bullets[bulletId]) {
                    bullets[bulletId].setXY(bulletState[BulletStateProps.X], bulletState[BulletStateProps.Y]);
                    bullets[bulletId].setRotation(bulletState[BulletStateProps.DIRECTION]);
                    updatedBullets[bulletId] = bullets[bulletId];
                } else {
                    const bulletType = bulletState[BulletStateProps.BULLET_TYPE];
                    const bulletProps = BulletProps[bulletType];
                    
                    updatedBullets[bulletId] = new Bullet({
                        ctx: context,
                        bullet_type: bulletType,
                        x: bulletState[BulletStateProps.X],
                        y: bulletState[BulletStateProps.Y],
                        scale: bulletProps.SPRITE_SCALE,
                        rotation: bulletState[BulletStateProps.DIRECTION]
                    });
                }
            }

            bullets = updatedBullets;

            // Resolve the load promise 
            // loadPromiseResolve();
        });
    }

    const draw = function() {

        console.log("Num bullets: ", Object.keys(bullets).length);
        for (let bullet of Object.values(bullets)) {
            bullet.draw();
        }
    }

    const getBullet = function(bulletId) {
        return bullets[bulletId];
    }

    return {
        init: init,
        draw: draw,
        getBullet: getBullet
    };
})();
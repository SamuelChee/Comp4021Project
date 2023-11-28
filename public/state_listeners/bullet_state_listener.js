
/**
 * This function provides a listener for Bullet events.
 * It enables initializing bullet states, updating them, drawing them on the canvas, and accessing bullet information.
 */ 
const BulletStateListener = (function () {
    // Define the context for drawing, the socket for communication, and the bullets object to hold bullet states
    let context = null;
    let socket = null;
    let bullets = {};
    let loadPromiseResolve;

    const loadPromise = new Promise((resolve, reject) => {
        loadPromiseResolve = resolve;
    });
    /**
     * Initialize the listener with the given context and socket
     * @param {Object} params - The context and socket to use
     */
    const init = function ({ context, socket }) {
        context = context;
        socket = socket;

        // Listen for 'update' event to update bullet states
        socket.on(SocketEvents.UPDATE, (update) => {
            // const updateObj = JSON.parse(update);

            // // Create a new object for the updated bullets
            // const updatedBullets = {};

            // Object.entries(updateObj.bulletStates).forEach(([bulletId, bulletState]) => {
            //     // If the bullet already exists, update it, otherwise initialize a new bullet
            //     if (bullets[bulletId]) {
            //         bullets[bulletId].setXY(bulletState.x, bulletState.y);
            //         bullets[bulletId].setRotation(bulletState.rotation);
            //         updatedBullets[bulletId] = bullets[bulletId];
            //     } else {
            //         updatedBullets[bulletId] = Bullet(context, bulletState.bullet_id, bulletState.x, bulletState.y, scale=2, rotation=bulletState.rotation);
            //     }
            // });

            // // Replace the bullets object with the updated bullets
            // bullets = updatedBullets;
            bullets = {
                "id": Bullet({
                  ctx: context, 
                  bullet_type: BulletTypes.BLUE, 
                  x: 100, 
                  y: 100, 
                  scale: BulletProps[BulletTypes.BLUE].SPRITE_SCALE, 
                  rotation: 0
                })
              };
        });
    }

    /**
     * Draw each bullet on the canvas
     */
    const draw = function () {
        for (let bullet of Object.values(bullets)) {
            bullet.draw();
        }
    }

    /**
     * Get a bullet's state by its bulletId
     * @param {string} bulletId - The bulletId of the bullet
     * @return {Object} The bullet's state
     */
    const getBullet = function (bulletId) {
        return bullets[bulletId];
    }

    // Return the public methods
    return {
        
        init: init,
        draw: draw,
        loadPromise: loadPromise,
        getBullet: getBullet
    };
})();
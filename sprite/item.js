/**
 * Constructs an Item object that represents a spawnable item for a player to pick up in a game field.
 *
 * @param {object} params - The parameters for creating the Item.
 * @param {CanvasRenderingContext2D} params.ctx - The canvas context to draw the item.
 * @param {number} params.wep_id - The weapon ID.
 * @param {number} params.x - The initial x position of the item.
 * @param {number} params.y - The initial y position of the item.
 * @param {number} params.lifetime - The total lifetime of the item in milliseconds.
 *
 * The Item will start to blink when its remaining lifetime is 30% of the total lifetime. It will disappear (become invisible) when the remaining lifetime is 0.
 *
 * @returns {object} An object representing the Item with various methods for manipulating, drawing, and updating its state.
 */
const Item = function({ctx, wep_id, x, y, lifetime}) {
    console.log = function() {}

    console.log(`Creating new item with lifetime ${lifetime}`);

    let DEFAULT_ITEM_SCALE = 1.3;
    const item = Weapon({ctx, wep_id, x, y, scale: DEFAULT_ITEM_SCALE});
    let blinkInterval;
    let checkLifetimeTimeout;
    let opacity = 1;
    let isVisible = true;
    
    let remainingLifetime = lifetime;
    const blinkStartLifetime = lifetime * 0.3; // 20% of total lifetime

    const startBlinking = function() {
        console.log("Starting to blink");
        const intervalTime = Math.max(50, remainingLifetime / 100);
        blinkInterval = setInterval(() => {
            opacity = (opacity === 1) ? 0.5 : 1;
            remainingLifetime -= intervalTime;
            if (remainingLifetime <= 0) {
                console.log("Blinking stopped");
                isVisible = false;
                console.log("here");
                clearInterval(blinkInterval);
                clearTimeout(checkLifetimeTimeout);
            }
        }, intervalTime); 
    };

    const checkLifetimeAndStartBlinking = function() {
        remainingLifetime -= 100;
        if (remainingLifetime <= blinkStartLifetime) {
            startBlinking();
        } else {
            checkLifetimeTimeout = setTimeout(checkLifetimeAndStartBlinking, 100);
        }
    };
    item.setOnLoad(checkLifetimeAndStartBlinking);
    
    // checkLifetimeAndStartBlinking()
    return {
        /**
         * Gets the current position of the item.
         *
         * @return {object} An object containing the x and y coordinates of the item.
         */
        getXY: item.getXY,

        /**
         * Sets the position of the item.
         *
         * @param {number} x - The new x position.
         * @param {number} y - The new y position.
         */
        setXY: item.setXY,

        /**
         * Gets the bounding box of the item, which can be used for collision detection.
         *
         * @return {object} An object representing the bounding box of the item.
         */
        getBoundingBox: item.getBoundingBox,

        /**
         * Removes the item from the game field. The item becomes invisible and stops blinking.
         */
        // remove: function() {
        //     isVisible = false;
        //     clearInterval(blinkInterval);
        // },

        /**
         * Draws the item on the canvas with its current opacity. The item will not be drawn if it's not visible.
         */
        draw: function() {
            console.log(`Drawing item with visibility ${isVisible}`);
            if(isVisible){
                ctx.save();
                ctx.globalAlpha = opacity;
                item.drawWithShadow();
                ctx.restore();
            }
        },

        /**
         * Updates the item's state by calling the update method of the underlying Weapon object. It also checks if the item should be destroyed based on its visibility.
         *
         * @return {boolean} Whether the item should be destroyed (true if the item is not visible, false otherwise).
         */
        update: function() {
            console.log("asd");
            // item.update();
            return isVisible;
        }

    };
};
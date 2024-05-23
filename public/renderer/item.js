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
        const intervalTime = Math.max(50, remainingLifetime / 100);
        blinkInterval = setInterval(() => {
            opacity = (opacity === 1) ? 0.5 : 1;
            remainingLifetime -= intervalTime;
            if (remainingLifetime <= 0) {
                isVisible = false;
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
        getXY: item.getXY,
        setXY: item.setXY,
        getBoundingBox: item.getBoundingBox,

        draw: function() {
            if(isVisible){
                ctx.save();
                ctx.globalAlpha = opacity;
                item.drawWithShadow();
                ctx.restore();
            }
        },
        update: function() {
            // item.update();
            return isVisible;
        }

    };
};


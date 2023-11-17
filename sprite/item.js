const Item = function({ctx, wep_id, x, y, lifetime}) {
    const item = Weapon({ctx, wep_id, x, y, scale: 2});
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
            console.log(remainingLifetime);
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

    return {
        getXY: item.getXY,
        setXY: item.setXY,
        getBoundingBox: item.getBoundingBox,
        remove: function() {
            isVisible = false;
            clearInterval(blinkInterval);
        },
        draw: function() {
            if(isVisible){
                ctx.save();
                ctx.globalAlpha = opacity;
                item.drawWithShadow();
                ctx.restore();
            }
        },
        update: function() {
            item.update();

            // Return whether the item should be destroyed
            return !isVisible;
        }
    };
};
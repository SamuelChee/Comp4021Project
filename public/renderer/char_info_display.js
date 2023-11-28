// This function defines the CharacterInfoDisplay module.
// - `ctx` - A canvas context for drawing
// - `x` - The initial x position of the character info
// - `y` - The initial y position of the character info
// - `username` - The player's username
const CharacterInfoDisplay = function (ctx, x, y, username, ammo_, canEquip_) {
    let playerWidth = PlayerConsts.SPRITE_WIDTH;
   // ... rest of your code ...

    let ammo = ammo_;
    let canEquip = canEquip_;
    // The health bar's full width and height
    let fullWidth = 40;
    let fullHeight = 5;

    // The full and current health
    let fullHealth = PlayerConsts.INI_HP;
    let curHealth = fullHealth;


    let HEALTH_BAR_OFFSET_X = -(fullWidth / 2);
    let HEALTH_BAR_OFFSET_Y = 8;
    let USERNAME_OFFSET_Y = 3;
    // Calculate the starting x and y positions for the health bar
    let healthBarX = x + HEALTH_BAR_OFFSET_X;
    let healthBarY = y + HEALTH_BAR_OFFSET_Y;

    // This function draws the character info: username and health bar.
    const draw = function () {
        // Draw the username
        ctx.textAlign = 'center';
        ctx.font = '12px Arial';

        // Check if the username belongs to the current player
        if (username === Authentication.getUser().username) {
            ctx.fillStyle = '#00FF00'; // Change to the desired color for the current player
        } else {
            ctx.fillStyle = '#FF0000'; // Default color for other players
        }
         // Draw ammo
         ctx.fillStyle = "white";
         ctx.font = "12px Eurostile";
         ctx.fillText(`Ammo: ${ammo}`, x, y - 10); 
 
      
        ctx.fillText(username, x, y + USERNAME_OFFSET_Y);

        // Draw the health bar border
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(healthBarX, healthBarY, fullWidth, fullHeight);

        // Draw the health bar current health (green)
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(healthBarX, healthBarY, fullWidth * (curHealth / fullHealth), fullHeight);

        // Draw the health bar missing health (red)
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(healthBarX + fullWidth * (curHealth / fullHealth), healthBarY, fullWidth * (1 - curHealth / fullHealth), fullHeight);
    };

    // This function sets the character info's position.
    const setXY = function (newX, newY) {
        x = newX;
        y = newY;

        // Update the health bar coordinates as well
        healthBarX = x + HEALTH_BAR_OFFSET_X;
        healthBarY = y + HEALTH_BAR_OFFSET_Y;
    };

    // This function sets the current health value.
    // - `newHealth` - A value between 0 and 100
    const setHealth = function (newHealth) {
        if (newHealth >= 0 && newHealth <= fullHealth) {
            curHealth = newHealth;
        }
    };
    const setAmmo = function (newAmmo) {
        ammo = newAmmo;
    };

    const setCanEquip = function (newCanEquip) {
        canEquip = newCanEquip;
    };
    // The methods are returned as an object here.
    return {
        draw: draw,
        setXY: setXY,
        setHealth: setHealth,
        setAmmo: setAmmo,
        setCanEquip: setCanEquip
    };
};
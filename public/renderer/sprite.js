let DEFAULT_SPRITE_SCALE = 2;

/**
 * Defines a Sprite module.
 *
 * @param {CanvasRenderingContext2D} ctx - A canvas context for drawing.
 * @param {number} x - The initial x position of the sprite.
 * @param {number} y - The initial y position of the sprite.
 * @returns {object} An object representing the Sprite with various methods for manipulating and drawing it.
 */
const Sprite = function (ctx, x, y) {

  // This is the image object for the sprite sheet.
  const sheet = new Image();


  // This is an object containing the sprite sequence information used by the sprite containing:
  // - `x` - The starting x position of the sprite sequence in the sprite sheet
  // - `y` - The starting y position of the sprite sequence in the sprite sheet
  // - `width` - The width of each sprite image
  // - `height` - The height of each sprite image
  // - `count` - The total number of sprite images in the sequence
  // - `timing` - The timing for each sprite image
  // - `loop` - `true` if the sprite sequence is looped
  let sequence = { x: 0, y: 0, width: 20, height: 20, count: 1, timing: 0, loop: false };

  // This is the index indicating the current sprite image used in the sprite sequence.
  let index = 0;
  let rotation = 0;
  // This is the scaling factor for drawing the sprite.
  let scale = 1;
  let flip = false;
  // This is the scaling factor to determine the size of the shadow, relative to the scaled sprite image size.
  // - `x` - The x scaling factor
  // - `y` - The y scaling factor
  let shadowScale = { x: 1, y: 0.25 };

  // This is the updated time of the current sprite image.
  // It is used to determine the timing to switch to the next sprite image.
  let lastUpdate = 0;

  // This function uses a new sprite sheet in the image object.
  // - `spriteSheet` - The source of the sprite sheet (URL)
  const useSheet = function (spriteSheet) {
    sheet.src = spriteSheet;
    return this;
  };
  const setRotation = function (angle) {
    rotation = angle;
    return this;
  };
  // This function returns the readiness of the sprite sheet image.
  const isReady = function () {
    if (!(sheet.complete && sheet.naturalHeight != 0)) {
      console.log("Sprite sheet is not ready");
    }
    return sheet.complete && sheet.naturalHeight != 0;
  };

  // This function gets the current sprite position.
  const getXY = function () {
    return { x, y };
  };

  // This function sets the sprite position.
  // - `xvalue` - The new x position
  // - `yvalue` - The new y position
  const setXY = function (xvalue, yvalue) {
    [x, y] = [xvalue, yvalue];
    return this;
  };

  // This function sets the sprite sequence.
  // - `newSequence` - The new sprite sequence to be used by the sprite
  const setSequence = function (newSequence) {
    sequence = newSequence;
    index = 0;
    lastUpdate = 0;
    return this;
  };

  const setFlip = function(new_flip){
    flip = new_flip
    return this;
  }


  // This function sets the scaling factor of the sprite.
  // - `value` - The new scaling factor
  const setScale = function (value) {
    scale = value;
    return this;
  };

  // This function sets the scaling factor of the sprite shadow.
  // - `value` - The new scaling factor as an object
  //   - `value.x` - The x scaling factor
  //   - `value.y` - The y scaling factor
  const setShadowScale = function (value) {
    shadowScale = value;
    return this;
  };

  // This function gets the display size of the sprite.
  const getDisplaySize = function () {
    /* Find the scaled width and height of the sprite */
    const scaledWidth = sequence.width * scale;
    const scaledHeight = sequence.height * scale;
    return { width: scaledWidth, height: scaledHeight };
  };

  // This function gets the bounding box of the sprite.
  const getBoundingBox = function () {
    /* Get the display size of the sprite */
    const size = getDisplaySize();

    /* Find the box coordinates */
    const top = y - size.height / 2;
    const left = x - size.width / 2;
    const bottom = y + size.height / 2;
    const right = x + size.width / 2;

    return BoundingBox(ctx, top, left, bottom, right);
  };

  // This function draws shadow underneath the sprite.
  const drawShadow = function () {
    /* Save the settings */
    ctx.save();

    /* Get the display size of the sprite */
    const size = getDisplaySize();

    /* Find the scaled width and height of the shadow */
    const shadowWidth = size.width * shadowScale.x;
    const shadowHeight = size.height * shadowScale.y;

    /* Draw a semi-transparent oval */
    ctx.fillStyle = "black";
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(x, y + size.height / 2,
      shadowWidth / 2, shadowHeight / 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    /* Restore saved settings */
    ctx.restore();
  };

  // This function draws the sprite.
  const drawSprite = function () {
    /* Save the settings */
    ctx.save();

    /* Get the display size of the sprite */
    const size = getDisplaySize();

    /* Translate to the center of the sprite */
    ctx.translate(x, y);

    /* Rotate the canvas */
    ctx.rotate(rotation * (Math.PI / 180));

    /* If flip is true, scale the context to flip the image */
    if (flip) {
      ctx.scale(-1, 1);
    }

    /* Translate back by half the size of the sprite */
    ctx.translate(-size.width / 2, -size.height / 2);

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      sheet,
      sequence.x + index * sequence.width, sequence.y,
      sequence.width, sequence.height,
      0, 0, // Draw the sprite at the new origin
      parseInt(size.width), parseInt(size.height)
    );

    /* Restore saved settings */
    ctx.restore();
  };

  // This function draws the shadow and the sprite.
  const drawWithShadow = function () {
    if (isReady()) {
      drawShadow();
      drawSprite();
    }
    return this;
  };

  // This function updates the sprite by moving to the next sprite
  // at appropriate time.
  // - `time` - The timestamp when this function is called
  const update = function (time) {
    if (lastUpdate == 0) lastUpdate = time;

    if (time - lastUpdate >= sequence.timing) {
      if (index < sequence.count - 1) {
        index += 1
      }
      else if (sequence.loop) {

        index = 0
      }
      lastUpdate = time

    }
    /* TODO */
    /* Move to the next sprite when the timing is right */


    return this;
  };

  // The methods are returned as an object here.
  return {
    useSheet: useSheet,
    getXY: getXY,
    setXY: setXY,
    setSequence: setSequence,
    setScale: setScale,
    setShadowScale: setShadowScale,
    setRotation: setRotation,
    getDisplaySize: getDisplaySize,
    getBoundingBox: getBoundingBox,
    isReady: isReady,
    drawWithShadow: drawWithShadow,
    draw: drawSprite,
    update: update,
    setFlip,
    setOnLoad: function (callback) {
      sheet.onload = callback;
    }
  };
};

/**
 * Defines a HorizontalSpriteGroup module that stacks sprites horizontally and treats the group as one sprite.
 *
 * @param {CanvasRenderingContext2D} ctx - A canvas context for drawing.
 * @param {number} x - The initial x position of the sprite group.
 * @param {number} y - The initial y position of the sprite group.
 * @returns {object} An object representing the HorizontalSpriteGroup with various methods for manipulating and drawing it.
 */
const HorizontalSpriteGroup = function (ctx, x, y, offset) {
  const sprites = []; // Array to hold the sprites in the group

  // This function adds a sprite to the group.
  // - `sprite` - The sprite object to be added to the group
  const addSprite = function (sprite) {
    // If there are already sprites in the group
    if (sprites.length > 0) {
      // Get the most right sprite
      const lastSprite = sprites[sprites.length - 1];

      // Get the size of the last sprite
      const lastSpriteSize = lastSprite.getDisplaySize();

      // Get the size of the new sprite
      const spriteSize = sprite.getDisplaySize();

      // Position the new sprite to the right of the last sprite
      const newX = lastSprite.getXY().x + (lastSpriteSize.width - 1) + offset;
      sprite.setXY(newX, y);
    }

    sprites.push(sprite);
    return this;
  };

  // This function removes a sprite from the group.
  // - `sprite` - The sprite object to be removed from the group
  const removeSprite = function (sprite) {
    const index = sprites.indexOf(sprite);
    if (index !== -1) {
      sprites.splice(index, 1);
    }
    return this;
  };

  // This function gets the current position of the sprite group.
  const getXY = function () {
    return { x, y };
  };

  // This function sets the position of the sprite group.
  // - `xvalue` - The new x position
  // - `yvalue` - The new y position
  const setXY = function (xvalue, yvalue) {
    [x, y] = [xvalue, yvalue];
    return this;
  };

  // This function sets the scaling factor of the sprite group.
  // - `value` - The new scaling factor
  const setScale = function (value) {
    sprites.forEach(sprite => sprite.setScale(value));
    return this;
  };

  // This function gets the display size of the sprite group.
  const getDisplaySize = function () {
    let width = 0;
    let height = 0;

    sprites.forEach(sprite => {
      const spriteSize = sprite.getDisplaySize();
      width += spriteSize.width;
      height = Math.max(height, spriteSize.height);
    });

    return { width, height };
  };

  // This function gets the bounding box of the sprite group.
  const getBoundingBox = function () {
    if (sprites.length === 0) {
      return BoundingBox(ctx, y, x, y, x);
    }
  
    /* Get the display size of the first and last sprite in the group */
    const firstSpriteSize = sprites[0].getDisplaySize();
    const lastSpriteSize = sprites[sprites.length - 1].getDisplaySize();
  
    /* Find the box coordinates based on the first and last sprite */
    const top = y - firstSpriteSize.height / 2;
    const left = sprites[0].getXY().x-lastSpriteSize.width/2;
    const bottom = y + firstSpriteSize.height / 2;
    const right = sprites[sprites.length - 1].getXY().x + lastSpriteSize.width/2;
  
    return BoundingBox(ctx, top, left, bottom, right);
  };

  // This function draws the sprite group.
  const draw = function () {
    /* Save the settings */
    ctx.save();

    /* Get the display size of the sprite group */
    //   const size = getDisplaySize();

    /* Translate to the center /of the sprite group */
    //   ctx.translate(x - size.width / 2, y - size.height / 2);

    /* Draw each sprite in the group */
    sprites.forEach(sprite => sprite.draw());

    /* Restore saved settings */
    ctx.restore();
  };

  // This function updates the sprite group by updating each sprite in the group.
  // - `time` - The timestamp when this function is called
  const update = function (time) {
    sprites.forEach(sprite => sprite.update(time));
    return this;
  };

  // The methods are returned as an object here.
  return {
    addSprite: addSprite,
    removeSprite: removeSprite,
    getXY: getXY,
    setXY: setXY,
    setScale: setScale,
    getDisplaySize: getDisplaySize,
    getBoundingBox: getBoundingBox,
    draw: draw,
    update: update
  };
};
/**
 * The BackgroundSpriteModule is an IIFE (Immediately Invoked Function Expression) 
 * that returns an object containing methods to create and manipulate 
 * background sprites and sprite groups. These can be used for creating 
 * backgrounds for game scenes.
 */
const BackgroundSpriteModule = (function () {
    const DEFAULT_SCALE = 2;
    /**
     * Creates a background sprite with specified properties.
     *
     * @param {object} spriteData - The sprite data containing source, dimensions, and default positions.
     * @param {boolean} [draggable=false] - Whether the sprite is draggable.
     * @param {number} [posX=null] - The x position of the sprite. If null, the sprite's default x position is used.
     * @param {number} [posY=null] - The y position of the sprite. If null, the sprite's default y position is used.
     * @param {number} [scale=null] - The scale factor of the sprite. If null, the default scale is used.
     * @param {number} [rotation=0] - The rotation angle of the sprite in degrees.
     *
     * @return {jQuery} The jQuery object representing the sprite.
     */
    const backgroundSprite = function ({ spriteData, draggable = false, posX = null, posY = null, scale = null, rotation = 0 }) {
        if (scale == null) {
            scale = DEFAULT_SCALE;
        }
        if (posX == null || posY == null) {
            posX = spriteData.spriteDefaultPosX;
            posY = spriteData.spriteDefaultPosY;
        }
        let sprite = $('<div>');
        sprite.css({
            position: 'absolute',
            left: posX,
            top: posY,
            width: spriteData.spriteWidth,
            height: spriteData.spriteHeight,
            backgroundImage: 'url(' + spriteData.src + ')',
            backgroundPosition: '-' + spriteData.spriteSheetStartX + 'px -' + spriteData.spriteSheetStartY + 'px',
            transform: 'scale(' + scale + ') rotate(' + rotation + 'deg)'
        });

        sprite.attr('id', spriteData.src.split('/').pop().split('.')[0]);

        return sprite;
    };
    /**
         * Creates a group of background sprites from an array of sprite data.
         *
         * @param {Array} spritesData - An array of sprite data objects.
         *
         * @return {Array} An array of jQuery objects representing the sprites.
         */
    const backgroundSpriteGroup = function (spritesData) {
        let group = [];
        for (let spriteData of spritesData) {
            let sprite = backgroundSprite(spriteData);
            group.push(sprite);
        }

        return group;
    };
    /**
         * Makes a sprite or a group of sprites draggable within the "#gameContainer" element.
         *
         * @param {jQuery|Array} spriteOrGroup - The jQuery object representing the sprite or an array of such objects.
         */
    const makeDraggable = function (spriteOrGroup) {

        if (Array.isArray(spriteOrGroup)) {
            for (let sprite of spriteOrGroup) {
                sprite.draggable({
                    containment: "#gameContainer",
                    scroll: false,
                    drag: function (event, ui) {
                        console.log("Current position: ", ui.position);
                    }
                });
            }
        }
        else {
            spriteOrGroup.draggable({
                containment: "#gameContainer",
                scroll: false,
                drag: function (event, ui) {
                    console.log("Current position: ", ui.position);
                }
            });
        }
    };
    /**
         * Draws a sprite or a group of sprites to a specified container.
         *
         * @param {string} container - The selector for the container to which the sprite(s) will be drawn.
         * @param {jQuery|Array} spriteOrGroup - The jQuery object representing the sprite or an array of such objects.
         */
    const drawToContainer = function (container, spriteOrGroup) {
        if (Array.isArray(spriteOrGroup)) {
            for (let sprite of spriteOrGroup) {
                $(container).append(sprite);
            }
        }
        else {
            $(container).append(spriteOrGroup);
        }
    };

    return {
        backgroundSprite: backgroundSprite,
        backgroundSpriteGroup: backgroundSpriteGroup,
        makeDraggable: makeDraggable,
        drawToContainer: drawToContainer
    };
})();
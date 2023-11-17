const BackgroundSpriteModule = (function() {
    const DEFAULT_SCALE = 2;

    const backgroundSprite = function({ spriteData, draggable = false, posX = null, posY = null, scale = null, rotation = 0 }) {
        if(scale == null){
            scale = DEFAULT_SCALE;
        }
        if(posX == null || posY == null){
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

    const backgroundSpriteGroup = function(spritesData) {
        let group = [];
        for (let spriteData of spritesData) {
            let sprite = backgroundSprite(spriteData);
            group.push(sprite);
        }

        return group;
    };

    const makeDraggable = function(spriteOrGroup){

        if (Array.isArray(spriteOrGroup)) {
            for(let sprite of spriteOrGroup){
                sprite.draggable({
                    containment: "#gameContainer",
                    scroll: false,
                    drag: function(event, ui) {
                        console.log("Current position: ", ui.position);
                    }
                });
            }
        }
        else{
            spriteOrGroup.draggable({
                containment: "#gameContainer",
                scroll: false,
                drag: function(event, ui) {
                    console.log("Current position: ", ui.position);
                }
            });
        }
    };

    const drawToContainer = function(spriteOrGroup) {
        if (Array.isArray(spriteOrGroup)) {
            for(let sprite of spriteOrGroup){
                $('#gameContainer').append(sprite);
            }
        }
        else {
            $('#gameContainer').append(spriteOrGroup);
        }
    };

    return {
        backgroundSprite: backgroundSprite,
        backgroundSpriteGroup: backgroundSpriteGroup,
        makeDraggable: makeDraggable,
        drawToContainer: drawToContainer
    };
})();
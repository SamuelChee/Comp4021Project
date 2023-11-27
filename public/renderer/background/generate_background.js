// background_generator.js

const BackgroundGenerator = (function () {

    /**
     * Function to initialize and draw all the background elements.
     * @param {Object} sprites - An object containing the sprites for the elements.
     * @param {string} containerId - The id of the container to draw the elements in.
     */
    function generateBackground(containerId) {

        var sprites = {
            "staticBackgroundWall":
            {
                "src": "./res/background.png",
                "spriteSheetStartX": 0,
                "spriteSheetStartY": 0,
                "spriteWidth": 423,
                "spriteHeight": 240,
                "spriteDefaultPosX": 211,
                "spriteDefaultPosY": 120,
                "spriteSequenceCount": 1,
                "spriteSequenceTiming": 0,
                "spriteSequenceLoop": false,
                "interactive": false
            },
            "staticBackGroundPipeBend":
            {
                "src": "./res/environment_set.png",
                "spriteSheetStartX": 4,
                "spriteSheetStartY": 53,
                "spriteWidth": 13,
                "spriteHeight": 13,
                "spriteDefaultPosX": 0,
                "spriteDefaultPosY": 0,
                "spriteSequenceCount": 1,
                "spriteSequenceTiming": 0,
                "spriteSequenceLoop": false,
                "interactive": false
            },

            "staticBackGroundPipeStraight":
            {
                "src": "./res/environment_set.png",
                "spriteSheetStartX": 21,
                "spriteSheetStartY": 53,
                "spriteWidth": 10,
                "spriteHeight": 16,
                "spriteDefaultPosX": 0,
                "spriteDefaultPosY": 0,
                "spriteSequenceCount": 1,
                "spriteSequenceTiming": 0,
                "spriteSequenceLoop": false,
                "interactive": false
            },

            "staticBackGroundPipeEnd":
            {
                "src": "./res/environment_set.png",
                "spriteSheetStartX": 35,
                "spriteSheetStartY": 53,
                "spriteWidth": 10,
                "spriteHeight": 12,
                "spriteDefaultPosX": 0,
                "spriteDefaultPosY": 0,
                "spriteSequenceCount": 1,
                "spriteSequenceTiming": 0,
                "spriteSequenceLoop": false,
                "interactive": false
            },

            "staticBackGroundPipeSupport":
            {
                "src": "./res/environment_set.png",
                "spriteSheetStartX": 53,
                "spriteSheetStartY": 66,
                "spriteWidth": 16,
                "spriteHeight": 7,
                "spriteDefaultPosX": 0,
                "spriteDefaultPosY": 0,
                "spriteSequenceCount": 1,
                "spriteSequenceTiming": 0,
                "spriteSequenceLoop": false,
                "interactive": false
            },

            "staticBackGroundVent":
            {
                "src": "./res/environment_set.png",
                "spriteSheetStartX": 12,
                "spriteSheetStartY": 73,
                "spriteWidth": 25,
                "spriteHeight": 16,
                "spriteDefaultPosX": 0,
                "spriteDefaultPosY": 0,
                "spriteSequenceCount": 1,
                "spriteSequenceTiming": 0,
                "spriteSequenceLoop": false,
                "interactive": false
            }
        };
        let backgroundWall = BackgroundSpriteModule.backgroundSprite({ spriteData: sprites.staticBackgroundWall });
        BackgroundSpriteModule.drawToContainer(containerId, backgroundWall)

        let backgroundPipes = [BackgroundSpriteModule.backgroundSpriteGroup(PipeGenerator.generatePipeSection(sprites, 180, 5,
            'down down left left left left left end')),
        BackgroundSpriteModule.backgroundSpriteGroup(PipeGenerator.generatePipeSection(sprites, 350, 219,
            'right right up up up up right down down down down down down down down left left end')),
        BackgroundSpriteModule.backgroundSpriteGroup(PipeGenerator.generatePipeSection(sprites, 660, 60,
            'down down down down right right end')),
        BackgroundSpriteModule.backgroundSpriteGroup(PipeGenerator.generatePipeSection(sprites, 660, 500,
            'up up up up right right down down down down end')),
        BackgroundSpriteModule.backgroundSpriteGroup(PipeGenerator.generatePipeSection(sprites, 100, 500,
            'up up up up up up up right right right right up up up up up end'))]
        for (let pipe of backgroundPipes) {
            BackgroundSpriteModule.drawToContainer(containerId, pipe);
        }

        let backgroundVents = BackgroundSpriteModule.backgroundSpriteGroup(VentGenerator.generateVents(sprites, [{ x: 75.5, y: 39 }, { x: 345.5, y: 134 },
        { x: 697.5, y: 291 }, { x: 259.5, y: 371 }, { x: 783.5, y: 65 }]));
        BackgroundSpriteModule.drawToContainer(containerId, backgroundVents);
    }

    return {
        generateBackground: generateBackground
    }
})();
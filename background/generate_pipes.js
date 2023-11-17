const PipeGenerator = (function () {


    // Helper function to get the rotation of the bend based on the previous and current directions
    function getBend(previousDirection, currentDirection) {
        // You would need to determine the correct rotations based on your sprites and game logic
        // For now, let's assume all bends are 90 degrees
        if (previousDirection == "up" && currentDirection == "right") {
            return { rotation: 0, x_offset: +2, y_offset: +4.5, dx: 32, dy: 0 };
        }
        else if (previousDirection == "up" && currentDirection == "left") {
            return { rotation: 90, x_offset: -4.9, y_offset: 4.5, dx: 32, dy: 0 };
        }
        else if (previousDirection == "right" && currentDirection == "down") {
            return { rotation: 90, x_offset: -4.6, y_offset: 4.5, dx: 0, dy: 32 };
        }
        else if (previousDirection == "right" && currentDirection == "up") {
            return { rotation: 180, x_offset: -4.6, y_offset: -2, dx: 0, dy: 32 };
        }
        else if (previousDirection == "down" && currentDirection == "left") {
            return { rotation: 180, x_offset: -5, y_offset: -1.8, dx: 32, dy: 2 };
        }
        else if (previousDirection == "down" && currentDirection == "right") {
            return { rotation: 270, x_offset: 2.2, y_offset: -1.8, dx: 32, dy: 2 };
        }
        else if (previousDirection == "left" && currentDirection == "up") {
            return { rotation: 270, x_offset: 1.5, y_offset: -1.6, dx: 2, dy: 32 };
        }
        else if (previousDirection == "left" && currentDirection == "down") {
            return { rotation: 0, x_offset: 1.5, y_offset: 5, dx: 2, dy: 32 };
        }
    }

    // Helper function to get the rotation of the support based on the current direction
    function getSupportRotation(currentDirection) {
        // You would need to determine the correct rotations based on your sprites and game logic
        // For now, let's assume all supports are 90 degrees
        if (currentDirection == "up" || currentDirection == "down") {
            return 0;
        }
        else if (currentDirection == "left" || currentDirection == "right") {
            return 90;
        }
    }

    // Helper function to get the rotation of the support based on the current direction
    function getEnd(currentDirection) {
        // You would need to determine the correct rotations based on your sprites and game logic
        // For now, let's assume all supports are 90 degrees
        if (currentDirection == "up") {
            return { rotation: 0, x_offset: 0, y_offset: 6 };
        }
        else if (currentDirection == "down") {
            return { rotation: 180, x_offset: 0, y_offset: -2 };
        }
        else if (currentDirection == "left") {
            return { rotation: 270, x_offset: 3.5, y_offset: 2 };
        }
        else if (currentDirection == "right") {
            return { rotation: 90, x_offset: -4, y_offset: 2 };
        }
    }

    function getStart(currentDirection) {
        // You would need to determine the correct rotations based on your sprites and game logic
        // For now, let's assume all supports are 90 degrees
        if (currentDirection == "up") {
            return { rotation: 180, x_offset: 0, y_offset: -29 };
        }
        else if (currentDirection == "down") {
            return { rotation: 0, x_offset: 0, y_offset: 25 };
        }
        else if (currentDirection == "left") {
            return { rotation: 90, x_offset: -26, y_offset: -2 };
        }
        else if (currentDirection == "right") {
            return { rotation: 270, x_offset: 27, y_offset: -2 };
        }
    }
    return {

        generatePipeSection: function (sprites, startX, startY, directionString) {
            const DIRECTION_MAP = {
                'down': { dx: 0, dy: 1, sprite: sprites.staticBackGroundPipeStraight, rotation: 0 },
                'up': { dx: 0, dy: -1, sprite: sprites.staticBackGroundPipeStraight, rotation: 180 },
                'left': { dx: -1, dy: 0, sprite: sprites.staticBackGroundPipeStraight, rotation: 90 },
                'right': { dx: 1, dy: 0, sprite: sprites.staticBackGroundPipeStraight, rotation: 270 },
                'end': { dx: 0, dy: 0, sprite: sprites.staticBackGroundPipeEnd, rotation: 0 } // Assuming there's a sprite for the pipe end
            };
            const PIPE_BEND = sprites.staticBackGroundPipeBend;
            const PIPE_SUPPORT = sprites.staticBackGroundPipeSupport;
            const SUPPORT_FREQUENCY = 2; // add a support every 3 straight pipes
            const TILE_SIZE = 32; // assuming 32 pixels per tile

            let x = startX;
            let y = startY;
            let pipeSection = [];

            const directions = directionString.trim().split(' ');
            let previousDirection = null;
            let straightCount = 0;



            for (let i = 0; i < directions.length; i++) {
                let direction = directions[i];
                let { dx, dy, sprite, rotation } = DIRECTION_MAP[direction];


                if (direction == 'end') {
                    let end = getEnd(previousDirection)
                    pipeSection.push({ spriteData: sprite, posX: x + end.x_offset, posY: y + end.y_offset, draggable: false, rotation: end.rotation });
                    break;
                }

                // Add a pipe bend if the direction has changed
                if (previousDirection && previousDirection !== direction) {
                    let bend = getBend(previousDirection, direction);

                    pipeSection.push({ spriteData: PIPE_BEND, posX: x + bend.x_offset, posY: y + bend.y_offset, draggable: false, rotation: bend.rotation });
                    x += dx * bend.dx;
                    y += dy * bend.dy;
                }




                // Add the pipe
                if (i == 0) {
                    let start = getStart(direction)
                    pipeSection.push({ spriteData: sprites.staticBackGroundPipeEnd, posX: x, posY: y, draggable: false, rotation: start.rotation });
                    x += dx + start.x_offset;
                    y += dy + start.y_offset;
                    pipeSection.push({ spriteData: sprite, posX: x, posY: y, draggable: false, rotation: rotation });

                    // Add a support if it's a straight pipe and we've reached the support frequency
                    if (sprite === sprites.staticBackGroundPipeStraight && ++straightCount % SUPPORT_FREQUENCY === 0) {
                        let supportRotation = getSupportRotation(direction);
                        pipeSection.push({ spriteData: PIPE_SUPPORT, posX: x - 3, posY: y, draggable: false, rotation: supportRotation });
                    }
                    x += dx * 32;
                    y += dy * 32;
                }
                else {
                    pipeSection.push({ spriteData: sprite, posX: x, posY: y, draggable: false, rotation: rotation });

                    // Add a support if it's a straight pipe and we've reached the support frequency
                    if (sprite === sprites.staticBackGroundPipeStraight && ++straightCount % SUPPORT_FREQUENCY === 0) {
                        let supportRotation = getSupportRotation(direction);
                        pipeSection.push({ spriteData: PIPE_SUPPORT, posX: x - 3, posY: y, draggable: false, rotation: supportRotation });
                    }
                    x += dx * 32;
                    y += dy * 32;
                }


                previousDirection = direction;
            }

            return pipeSection;
        }
    };

})();


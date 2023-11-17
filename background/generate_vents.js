const VentGenerator = (function () {

    return {
        /**
             * Function to generate vents.
             * @param {Object} sprites - An object containing the sprites for the vents.
             * @param {Array} coordinates - An array of objects, each containing x and y coordinates for a vent.
             * @returns {Array} - An array of objects, each representing a vent with its sprite data and position.
             */
        generateVents: function (sprites, coordinates) {

            let ventData = [];

            for (let coord of coordinates) {

                ventData.push({ spriteData: sprites.staticBackGroundVent, posX: coord.x, posY: coord.y });

            }
            return ventData;
        }
    };

})();



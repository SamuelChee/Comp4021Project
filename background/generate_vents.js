const VentGenerator = (function () {

    return {

        generateVents: function (sprites, coordinates) {

            let ventData = [];

            for (let coord of coordinates){

                ventData.push({spriteData: sprites.staticBackGroundVent, posX: coord.x, posY: coord.y});

            }
            return ventData;
        }
    };

})();



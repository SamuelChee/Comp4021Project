/**
 * Constructs an ItemCtrl object to control the spawning of items in the game.
 *
 * @param {object} params - The parameters for creating the ItemCtrl.
 * @param {CanvasRenderingContext2D} params.ctx - The canvas context to draw the item.
 * @param {Array} params.platforms - An array of existing platform objects.
 * @param {Array} params.spawnChance - The chance of each type of item spawning on a platform.
 * @param {number} params.itemLifetime - The lifetime of a spawned item in milliseconds.
 *
 * @returns {object} An object representing the ItemCtrl with methods for spawning and updating items.
 */
const ItemCtrl = function ({ context: ctx, platforms: platforms }) {

    weapon_spawn_params = { spawnChance: [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], itemLifetime: [5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000] };


    let items = [];

    const poissonRandom = function (lambda) {
        let L = Math.exp(-lambda);
        let p = 1.0;
        let k = 0;

        do {
            k++;
            p *= Math.random();
        } while (p > L);

        return k - 1;
    };

    const spawnItem = function (elapsedTime) {
        platforms.forEach((platform) => {
            const boundingBox = platform.getBoundingBox();

            const lambda = 0.0001;  // Adjust the denominator to control the rate of increase
            const spawnNumbers = weapon_spawn_params.spawnChance.map(chance => poissonRandom(lambda));

            spawnNumbers.forEach((num, wep_id) => {
                for (let i = 0; i < num; i++) {
                    const { x, y } = boundingBox.randomPoint();
                    let newY = boundingBox.getTop();
                    
                    const item = Item({ctx: ctx, wep_id: wep_id, x: x, y: newY-10, lifetime: weapon_spawn_params.itemLifetime[wep_id]});
                  
                    items.push(item);
                }
            });
        });
    };

    const updateItems = function () {
        items = items.filter(item => item.update());
    };

    const drawItems = function () {
        items.forEach(item => item.draw());
    };

    return {
        spawnItem,
        updateItems,
        drawItems
    };
};
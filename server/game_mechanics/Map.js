const {
    Directions,
    Keys,
    Actions,
    PlayerStateProps,
    PlatformDataProps,
    LoadLevelProps,
    ServerUpdateProps,
    MapStateProps,
    MapConsts,
    ItemSpawnerDataProps,
    ItemType
} = require('../../shared/constants');

const { BoundingBox } = require("./bounding_box");

const Map = function () {
    let area = BoundingBox(0, 20, 475, 820); // TODO: change this
    let platforms = null;
    let items = null;

    let offset = 100;

    let platform_boxes = [];
    let item_spawners = [];


    let initialPlayerLocations = {};
    let initialPlayerDirections = {};


    // initializes the map, probably don't need this if we don't plan on randomly initializing 
    // items.
    const initialize = function (account1, account2, mapState) {
        // mapinfo could contain boundingboxes for obstacles, position of the items and their 
        // spawn probabilities?

        // convert platforms into bounding boxes
        platforms = MapConsts.PLATFORMS;

        for (let i = 0; i < platforms.length; i++) {
            let platform = platforms[i];

            let box = BoundingBox(
                platform.y - MapConsts.PLATFORM_HEIGHT / 2,
                platform.x - MapConsts.PLATFORM_WIDTH / 2 + offset,
                platform.y + MapConsts.PLATFORM_HEIGHT / 2,
                platform.x + MapConsts.PLATFORM_WIDTH / 2 + offset
            )
            platform_boxes.push(box);
            box.printBox();
        }
        console.log(platforms);

        // Initialize item spawners
        items = MapConsts.ITEMS;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];


            item_spawners.push({
                [ItemSpawnerDataProps.X]: item.x,
                [ItemSpawnerDataProps.Y]: item.y,
                [ItemSpawnerDataProps.PROBABILITY]: item.probability,
                [ItemSpawnerDataProps.TIME]: item.spawnTime,
                [ItemSpawnerDataProps.SPAWNED]: false,
                [ItemSpawnerDataProps.CAN_SPAWN]: true,
                [ItemSpawnerDataProps.TYPE]: ItemType.AMMO
            });
        }

    };
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
    // Initialize an array to store the timers
    let timers = [];

    let lastUpdate = Date.now();
    function update() {
        let now = Date.now();
        let deltaTime = (now - lastUpdate) / 1000;  // convert from ms to s
        lastUpdate = now;
        for (let index = 0; index < item_spawners.length; index++) {
            let itemSpawner = item_spawners[index];
    
            // console.log(`Item Spawner ${index}:`);
            // console.log(`CAN_SPAWN = ${itemSpawner[ItemSpawnerDataProps.CAN_SPAWN]}`);
            // console.log(`SPAWNED = ${itemSpawner[ItemSpawnerDataProps.SPAWNED]}`);
    
            if (!itemSpawner[ItemSpawnerDataProps.SPAWNED] && itemSpawner[ItemSpawnerDataProps.CAN_SPAWN]) {
                let shouldSpawn = poissonRandom(0.1 * deltaTime) > 0;
    
                if (shouldSpawn) {
                    spawnItem(itemSpawner);
                    itemSpawner[ItemSpawnerDataProps.SPAWNED] = true;
                    itemSpawner[ItemSpawnerDataProps.CAN_SPAWN] = false;
    
                    // set timer for item's lifetime
                    timers[index] = setTimeout(() => {
                        itemSpawner[ItemSpawnerDataProps.SPAWNED] = false;
                        // set timer for item respawn delay
                        setTimeout(() => {
                            itemSpawner[ItemSpawnerDataProps.CAN_SPAWN] = true;
                        }, MapConsts.ITEM_SPAWN_TIMEOUT);
                    }, MapConsts.ITEM_SPAWN_TIME);
                }
            }
        }
    }

    const takeItem = function (index) {
        // Despawn the item
        item_spawners[index][ItemSpawnerDataProps.SPAWNED] = false;
        
        // Prevent the item from spawning while it's taken
        item_spawners[index][ItemSpawnerDataProps.CAN_SPAWN] = false;
    
        // Clear the timer
        clearTimeout(timers[index]);
    
        // Set a new timer to ensure a delay of at least 4 seconds before the item can spawn again
        timers[index] = setTimeout(() => {
            // The item can now spawn again
            item_spawners[index][ItemSpawnerDataProps.CAN_SPAWN] = true;
        }, MapConsts.ITEM_SPAWN_TIMEOUT);
    };

    const generateRandomValue = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const spawnItem = (itemSpawner) => {
        // Determine the itemType by generating a random number between 0 and 2
        let itemType;
        switch (generateRandomValue(0, 2)) {
            case 0:
                itemType = ItemType.WEP;
                break;
            case 1:
                itemType = ItemType.HEALTH;
                break;
            case 2:
                itemType = ItemType.AMMO;
                break;
        }

        // Update the itemType
        itemSpawner[ItemSpawnerDataProps.TYPE] = itemType;

        // Depending on the itemType, set the corresponding property
        if (itemType === ItemType.WEP) {
            itemSpawner[ItemSpawnerDataProps.WEP_ID] = generateRandomValue(0, 7);
        } else if (itemType === ItemType.HEALTH) {
            itemSpawner[ItemSpawnerDataProps.HEALTH_COUNT] = generateRandomValue(20, 60);
        } else if (itemType === ItemType.AMMO) {
            itemSpawner[ItemSpawnerDataProps.AMMO_COUNT] = generateRandomValue(20, 60);
        }
    };

    const getPlayerInitialPos = function (username) {
        if (username in initialPlayerLocations) {
            return initialPlayerLocations[username];
        }
        console.log("Error! Player not found in map data!");
        return [0, 0];
    };

    const getPlayerInitialDir = function (username) {
        if (username in initialPlayerDirections) {
            return initialPlayerDirections[username];
        }

        console.log("Error! Player not found in map data!");
        return [0, 0];
    };
    // Returns all information about the map that can be used for initialization.
    const getMapState = function () {
        return {
            [MapStateProps.PLATFORMS]: platforms,
            [MapStateProps.ITEMS]: item_spawners,
            [MapStateProps.INI_PLAYER_LOCS]: initialPlayerLocations,
            [MapStateProps.INI_PLAYER_DIRS]: initialPlayerDirections
        };
    };

    const getPlatforms = function () {
        return platforms;
    };

    const getPlatformBoxes = function () {
        return platform_boxes;
    };

    const getItems = function () {
        return items;
    };

    const getGameArea = function () {
        return area;
    };

    // Get item spawners
    const getItemSpawners = function () {
        return item_spawners;
    }



    return {
        initialize,
        getMapState,
        getPlatforms,
        getItems,
        getPlayerInitialPos,
        getPlayerInitialDir,
        getGameArea,
        getPlatformBoxes,
        takeItem,
        update,
        getItemSpawners,
    };
};

module.exports = { Map };
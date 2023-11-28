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
    ItemSpawnerDataProps
} = require('../../shared/constants');

const {BoundingBox} = require("./bounding_box");

const Map = function () {
    let area = BoundingBox(0, 50, 450, 820); // TODO: change this
    let platforms = null;
    let items = null;

    let offset = 100;

    let platform_boxes = [];
    let item_spawners = [];

    let timers = {};

    let initialPlayerLocations = {};
    let initialPlayerDirections = {};


    // initializes the map, probably don't need this if we don't plan on randomly initializing 
    // items.
    const initialize = function (account1, account2, mapState) {
        // mapinfo could contain boundingboxes for obstacles, position of the items and their 
        // spawn probabilities?

        // convert platforms into bounding boxes
        platforms = MapConsts.PLATFORMS;

        for(let i = 0; i < platforms.length; i++){
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
        for(let i = 0; i < items.length; i++){
            let item = items[i];

            let box = BoundingBox(
                item.y - MapConsts.PLATFORM_HEIGHT / 2,
                item.x - MapConsts.PLATFORM_WIDTH / 2 + offset,
                item.y + MapConsts.PLATFORM_HEIGHT / 2,
                item.x + MapConsts.PLATFORM_WIDTH / 2 + offset
            )

            item_spawners.push({
                [ItemSpawnerDataProps.BOX] : box, 
                [ItemSpawnerDataProps.X]: item.x, 
                [ItemSpawnerDataProps.Y]: item.y, 
                [ItemSpawnerDataProps.PROBABILITY]: item.probability, 
                [ItemSpawnerDataProps.TIME]: item.spawnTime, 
                [ItemSpawnerDataProps.SPAWNED]: true,
                [ItemSpawnerDataProps.TYPE]: randomItemType(item.probability)
            });
            box.printBox();
        }


        // TODO: initialize items 
        // if you don't want to randomly initialize items then just assign items from mapinfo to Map.items
        // items 
        // items = mapInfo.items;

        // initialize the initial positions and directions of the players on the map, assign it to users
        // initialPlayerLocations[account1.username] = mapInfo.initialPlayerLocations[0];
        // initialPlayerLocations[account2.username] = mapInfo.initialPlayerLocations[1];
        // initialPlayerDirections[account1.username] = mapInfo.initialPlayerDirections[0];
        // initialPlayerDirections[account2.username] = mapInfo.initialPlayerDirections[1]; 
    };

    const getPlayerInitialPos = function(username){
        if(username in initialPlayerLocations){
            return initialPlayerLocations[username];
        }
        console.log("Error! Player not found in map data!");
        return [0, 0];
    };

    const getPlayerInitialDir = function(username){
        if(username in initialPlayerDirections){
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
            [MapStateProps.INI_PLAYER_DIRS]: initialPlayerDirections};};

    const getPlatforms = function(){
        return platforms;
    };

    const getPlatformBoxes = function(){
        return platform_boxes;
    };

    const getItems = function(){
        return items;
    };

    const getGameArea = function(){
        return area;
    };

    // Generates random item based on probabilities.
    const randomItemType = function(p){
        let type = Math.random() < p;
        return type ? MapConsts.HEALTH: MapConsts.AMMO;
    }

    // Get item spawners
    const getItemSpawners = function(){
        return item_spawners;
    }

    // resets the spawner and deletes the corresponding timer that called this.
    const resetSpawner = function(id, idx){
        item_spawners[idx].spawned = true;
        timers.delete[id];

    }

    // Registers when a player takes an item. 
    const takeItem = function(idx){
        item_spawners[idx][ItemSpawnerDataProps.SPAWNED] = false;
        item_spawners[idx][ItemSpawnerDataProps.TYPE] = randomItemType(item_spawners[idx][ItemSpawnerDataProps.PROBABILITY]);

        // generate random id for timer, the id isn't really necessary, its just so
        // we could use a dictionary so that we don't have to shift every element
        // whenever we remove an element
        let id = Util.generateID(timers, 1024);
        timers[id] = ({timer: setTimeout(
            () => {
                resetSpawner(id, idx);
            }
        ), idx: idx});
    }

    return { initialize, 
        getMapState, 
        getPlatforms, 
        getItems, 
        getPlayerInitialPos, 
        getPlayerInitialDir, 
        getGameArea,
        getPlatformBoxes,
        getItemSpawners,
        takeItem};
};

module.exports = {Map};
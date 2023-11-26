const {BoundingBox} = require("../../sprite/bounding_box");

const Map = function(){

    let platforms = null;
    let items = null;

    let initialPlayerLocations = {};
    let initialPlayerDirections = {};

    let gameArea = BoundingBox(165, 60, 420, 800); // TODO: change this

    // initializes the map, probably don't need this if we don't plan on randomly initializing 
    // items.
    const initialize = function(mapInfo, account1, account2){
        // mapinfo could contain boundingboxes for obstacles, position of the items and their 
        // spawn probabilities?

        platforms = mapInfo.platforms;

        // TODO: initialize items 
        // if you don't want to randomly initialize items then just assign items from mapinfo to Map.items
        // items 
        items = mapInfo.items;

        // initialize the initial positions and directions of the players on the map, assign it to users
        initialPlayerLocations[account1.username] = mapInfo.initialPlayerLocations[0];
        initialPlayerLocations[account2.username] = mapInfo.initialPlayerLocations[1];
        initialPlayerDirections[account1.username] = mapInfo.initialPlayerDirections[0];
        initialPlayerDirections[account2.username] = mapInfo.initialPlayerDirections[1]; 
    }

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
    }
    // Returns all information about the map that can be used for initialization.
    const getMapInfo = function(){
        return {platforms, items, initialPlayerLocations, initialPlayerDirections};
    }

    const getPlatforms = function(){
        return platforms;
    }

    const getItems = function(){
        return items;
    }

    const getGameArea = function(){
        return gameArea;
    }

    return {
        initialize, 
        getMapInfo, 
        getPlatforms, 
        getItems, 
        getPlayerInitialPos, 
        getPlayerInitialDir,
        getGameArea};
};

if(typeof(module) === "object")
    module.exports = {Map};
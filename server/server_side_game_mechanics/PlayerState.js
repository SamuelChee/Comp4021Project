const {BoundingBox} = require("../../sprite/bounding_box");


const PlayerState = function(playerInfo, initPosition){

    // contains player name, avatar and profile
    let info = playerInfo;
    let health = 100;

    // position is the top left corner of the bounding box enclosing the player (smallest x, smallest y)
    let position = initPosition;
    let direction = [];

    let speed = 1; // change this
    let player_width = 50; // change this
    let player_height = 50; // change this
    
    // bounding box representing the player
    let bounding_box = Boundingbox(
        initPosition.y, 
        initPosition.x, 
        initPosition.y + player_height,
        initPosition.x + player_width);  //top left bottom right


    let statistics = {
        kills: 0,
        deaths: 0,
        survivalTime: 0,
        shotsFired: 0,
        numberOfItemsPickedUp: 0
    };

    // maybe use this to inform the client of some sort effect that the player is experiencing
    // e.g. take damage => player sprite turns red, invincibility => player sprite flashes
    let status = 0;
    let ammo = 0;



    const getPlayerState = function(){
        return {health, position, direction, ammo, status};
    }

    const getPlayerStatistics = function(){
        return statistics;
    }

    const setDirection = function(newDirection){
        direction = newDirection;
    }

    const move = function(obstacles, gameArea){
        
    }

    return {getPlayerState, getPlayerStatistics, setDirection}
};

if(typeof(module) === "object")
    module.exports = {PlayerState};
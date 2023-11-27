const {BoundingBox} = require("./bounding_box");


const PlayerState = function(playerInfo, initPosition){

    // contains player name, avatar and profile
    let info = playerInfo;
    let health = 100;

    // position is the center of the player's bounding box
    let position = initPosition;
    let direction = [];

    // aim direction
    let aimDirection = [];

    let speed = 1; // change this
    let player_width = 50; // change this
    let player_height = 50; // change this
    
    // bounding box representing the player
    let bounding_box = Boundingbox(
        initPosition.y - player_height / 2, 
        initPosition.x - player_height / 2, 
        initPosition.y + player_height / 2,
        initPosition.x + player_width / 2);  //top left bottom right

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
        return {health, position, direction, ammo, status, aimDirection};
    }

    const getPlayerStatistics = function(){
        return statistics;
    }

    const setDirection = function(newDirection){
        direction = newDirection;
    }

    const move = function(obstacles, gameArea){
        
    }

    const detectCollision = function(box){
        return box.isPointInBox(position.x, position.y)
    }

    const takeDamage = function(damage){
        health -= damage;
    }

    const isDead = function(){
        return health <= 0;
    }

    return {getPlayerState, getPlayerStatistics, setDirection, detectCollision, takeDamage, isDead};
};

if(typeof(module) === "object")
    module.exports = {PlayerState};
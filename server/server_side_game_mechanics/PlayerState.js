// This is just a placeholder.

const PlayerState = function(playerInfo, initPosition){

    // contains player name, avatar and profile
    let info = playerInfo;
    let health = 100;
    let position = initPosition;
    let direction = [];

    let speed = 1;

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

    const move = function(){
        
    }

    return {getPlayerState, getPlayerStatistics, setDirection}
};
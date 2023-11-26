// This is just a placeholder.

const PlayerState = function(playerInfo, initPosition){

    // contains player name, avatar and profile
    // let info = playerInfo;
    // let health = 100;
    let x = initPosition.x;
    let y = initPosition.y;
    let direction_multiple = {"left": -1, "right": 1, "jump": 1};
    let direction = "right";
    let speed = 5;

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

    const getPlayerPosition = function(){
        return{x: x, y: y};
        // return {health, position, direction, ammo, status};
    }

    const getPlayerDirection = function(){
        return direction;
        // return {health, position, direction, ammo, status};
    }

    // const getPlayerStatistics = function(){
    //     return statistics;
    // }

    // const setDirection = function(newDirection){
    //     direction = newDirection;
    // }

    const move = function(dir){
        direction = dir
        x = x + speed * direction_multiple[dir];
        console.log("Moving ", dir, ": ", x);
        
    }

    return {getPlayerPosition, move, getPlayerDirection}//, getPlayerStatistics, setDirection}
};

module.exports = PlayerState;

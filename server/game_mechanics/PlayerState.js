const { Directions, Keys, Actions } = require('../../shared/enums');

const PlayerState = function(playerInfo, initPosition){
    username = "username";
    // contains player name, avatar and profile
    // let info = playerInfo;
    // let health = 100;
    let x = initPosition.x;
    let y = initPosition.y;
    let xDirectionMultiple = {
        [Directions.LEFT]: -1,
        [Directions.RIGHT]: 1
      };    
    let xVel = 5;
    let action = Actions.IDLE; // move
    let direction = Directions.RIGHT; // left, right
    let aimAngle = 0;
    
    let yVel = 0;
    let terminalVel = 20;
    let jumpVel = -20;
    let gravitationalAcceleration = 2;
    let isFalling = false;

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

    const update = function(inputStateManager){

            if(y > initPosition.y){
                y = initPosition.y;
                yVel = 0;
                isFalling = false;
            }

            if(isFalling){
                if(yVel < terminalVel){
                    yVel=yVel+gravitationalAcceleration;
                }
                y = y + yVel;
            }
            else if(inputStateManager.getKeyPressed(username, Keys.JUMP)){
                console.log("jump");
                yVel=jumpVel;
                isFalling = true;
            }

            if (inputStateManager.getKeyPressed(username, Keys.LEFT)) {
                direction = Directions.LEFT;
                action = Actions.MOVE;
                x = x + xVel * xDirectionMultiple[direction];
            }
            else if(inputStateManager.getKeyPressed(username, Keys.RIGHT)) {
                direction = Directions.RIGHT;
                action = Actions.MOVE;
                x = x + xVel * xDirectionMultiple[direction];
            }
            else{
                action = Actions.IDLE;
            }
            aimAngle = inputStateManager.getAimAngle(username);

    }

    const getObj = function() {
        return {
            x,
            y,
            action,
            direction,
            aimAngle
        };
    }


    const getPlayerPosition = function(){
        return{x, y};
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

 

    return {getPlayerPosition, getPlayerDirection, update, getObj}//, getPlayerStatistics, setDirection}
};

module.exports = PlayerState;

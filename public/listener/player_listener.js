
const PlayerListener = (function () {
    let ctx = null;
    let socket = null;
    let players = {};
    let prev_action = null;
    let prev_direction = null;
    const init = function ({ ctx: ctxParam, socket: socketParam }) {
        ctx = ctxParam;
        socket = socketParam;
        socket.on('load level', function (event) {
            const event_data = JSON.parse(event);
            console.log(event_data);
        
            players = Object.entries(event_data.playerStates).reduce((result, [username, playerState]) => {
                result[username] = Player(ctx, playerState.x, playerState.y );
                console.log(playerState.x, playerState. y);
                result[username].setWeapon(playerState.wepID);
                return result;
            }, {});
            console.log(players);
        });


        socket.on("update", (update) => {

            update = JSON.parse(update);
            const { x, y, action, direction, aimAngle} = update.playerState;
            // console.log(x, y, action, direction);

            players["username"].setXY(x, y);
            players["username"].setWeaponRotation(aimAngle);

            
            if(action === prev_action && direction === prev_direction){
                return;
            }
            else{
                if(action === Actions.IDLE){
                    console.log("idling");
                    players["username"].idle_animation(direction);
                }
                else if(action === Actions.MOVE){
                    console.log("moving");
                    players["username"].move_animation(direction);
                }

                prev_action = action;
                prev_direction = direction
            }


            // player_state = update_data.playerStates["username"];
            // players["username"].move_animation("right");
            // players["username"].setXY(player_state.x, player_state.y);
            //     // if (updateObject.type === "player") {
            //     //     const player = players.find(p => p.id === updateObject.id);
            //     //     if (player) {
            //     //         player.x = updateObject.x;
            //     //         player.y = updateObject.y;
            //     //         player.draw();
            //     //     }
            //     // }
        });
    }

    const draw = function() {
        for (let player of Object.values(players)) {
            player.draw();
        }
    }

    const update = function(timestamp) {
        for (let player of Object.values(players)) {
            player.update(timestamp);
        }
    }

    const getPlayer = function(username){
        return players[username];
    }

    



    return {
        init: init,
        draw: draw,
        update: update,
        getPlayer, getPlayer
    };
})();
const PlayerListener = (function () {
    let ctx = null;
    let socket = null;
    let players = {};

    const init = function ({ ctx: ctxParam, socket: socketParam }) {
        ctx = ctxParam;
        socket = socketParam;
        socket.on('load level', function (event) {
            const event_data = JSON.parse(event);
            console.log(event_data);
        
            players = Object.entries(event_data.playerStates).reduce((result, [username, playerState]) => {
                result[username] = Player(ctx, playerState.x, playerState.y );
                result[username].setWeapon(playerState.wepID);
                return result;
            }, {});
            console.log(players);
        });


        socket.on("update", (update) => {
            update_data = JSON.parse(update);
            player_state = update_data.playerStates["username"]
            players["username"].move_animation(player_state.direction)
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



    return {
        init: init,
        draw: draw
    };
})();
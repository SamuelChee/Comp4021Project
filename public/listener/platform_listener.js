const PlatformListener = (function() {
    let ctx = null;
    let socket = null;

    const init = function({ ctx, socket }) {

        ctx = ctx;
        socket = socket;

        socket.on('load level', function (event) {
            const event_data = JSON.parse(event);
            console.log(event_data.map.platforms);
            const platforms = event_data.map.platforms.map(platformData =>
                Platform({ ctx: ctx, type: platformData.type, x: platformData.x, y: platformData.y, num_platforms: platformData.num_platforms })
            );

            for (let platform of platforms) {
                platform.draw();
            }
        });
    };

    return {
        init: init
    };
})();
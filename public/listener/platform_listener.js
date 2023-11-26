const PlatformListener = (function() {
    let context_ = null;
    let socket_ = null;
    let platforms = null;

    const init = function({ctx, socket}) {

        context_ = ctx;
        socket_ = socket;

        socket.on('load level', function (event) {
            const event_data = JSON.parse(event);
            const platform_data = event_data.map.platforms.map(platformData =>
                Platform({ ctx: ctx, type: platformData.type, x: platformData.x, y: platformData.y, num_platforms: platformData.num_platforms })
            );
            platforms = platform_data;
        });
    };

    const draw = function(){
        if (platforms) {
            platforms.forEach(platform => platform.draw());
        }
    };

    return {
        init: init,
        draw: draw
    };
})();
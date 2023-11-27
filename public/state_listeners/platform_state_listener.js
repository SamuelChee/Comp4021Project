const PlatformStateListener = (function() {
    let context = null;
    let socket = null;
    let platforms = null;

    const init = function({context, socket}) {

        context = context;
        socket = socket;

        socket.on('load level', function (event) {
            const eventData = JSON.parse(event);
            platforms = eventData.map.platforms.map(platformData =>
                Platform({ ctx: context, type: platformData.type, x: platformData.x, y: platformData.y, num_platforms: platformData.num_platforms })
            );
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
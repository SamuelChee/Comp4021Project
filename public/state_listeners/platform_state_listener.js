
/**
 * This function provides a listener for Platform events.
 * It enables initializing platform states, drawing them on the canvas, and accessing platform information.
 */
const PlatformStateListener = (function () {
    // Define the context for drawing, the socket for communication, and the platforms array to hold platform states
    let context = null;
    let socket = null;
    let platforms = [];

    // Flag to check if all platforms have been loaded
    let isLoaded = false;
    let loadPromiseResolve;

    const loadPromise = new Promise((resolve, reject) => {
        loadPromiseResolve = resolve;
    });
    
    /**
     * Initialize the listener with the given context and socket
     * @param {Object} params - The context and socket to use
     */
    const init = function ({ context, socket }) {
        context = context;
        socket = socket;

        // console.log("here");
        // Listen for 'load level' event to initialize platform states
        socket.on(SocketEvents.LOAD_LEVEL, function (event) {
            const eventData = JSON.parse(event);
            
            // Map platform states from the event data to the platforms array
            platforms = eventData[LoadLevelProps.MAP_STATE][MapStateProps.PLATFORMS].map(platformData =>
                Platform({ 
                    ctx: context, 
                    type: platformData[PlatformDataProps.TYPE], 
                    x: platformData[PlatformDataProps.X], 
                    y: platformData[PlatformDataProps.Y], 
                    num_platforms: platformData[PlatformDataProps.NUM_PLATFORMS]
                })
            );
            loadPromiseResolve();
            isLoaded = true; // Set flag to true after populating the platforms array
        });
    };

    /**
     * Draw each platform on the canvas
     */
    const draw = function () {
        if (platforms) {
            platforms.forEach(platform => platform.draw());
        }
    };

    /**
     * Get a platform's state by its index
     * @param {number} index - The index of the platform
     * @return {Object} The platform's state
     */
    const getPlatform = function (index) {
        return platforms[index];
    };

    const getIsLoaded = function () {
        return isLoaded; 
    };

    // Return the public methods
    return {
        init: init,
        draw: draw,
        getPlatform: getPlatform,
        getIsLoaded: getIsLoaded,
        loadPromise: loadPromise
    };
})();
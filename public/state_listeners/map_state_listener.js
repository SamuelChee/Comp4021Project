const MapStateListener = (function() {
    let context = null;
    let socket = null;

    let spawners = [];

    // Flag to check if all items have been loaded
    let isLoaded = false;
    let loadPromiseResolve;

    const loadPromise = new Promise((resolve, reject) => {
        loadPromiseResolve = resolve;
    });


    const init = function({ context, socket }) {
        context = context;
        socket = socket;

        socket.on(SocketEvents.LOAD_LEVEL, function (event) {
            const eventData = JSON.parse(event);
            spawners = eventData[LoadLevelProps.MAP_STATE][MapStateProps.ITEMS].map(spawner => 
                ItemSpawner({
                    ctx: context,
                    type: spawner[ItemSpawnerDataProps.TYPE],
                    x: spawner[ItemSpawnerDataProps.X],
                    y: spawner[ItemSpawnerDataProps.Y],
                    spawned: spawner[ItemSpawnerDataProps.SPAWNED]
                })

            );

            loadPromiseResolve();
            isLoaded = true; // Set flag to true after populating the platforms array
        });

        socket.on(SocketEvents.UPDATE, (update) => {
            const updateObj = JSON.parse(update);

            const itemSpawners = updateObj[ServerUpdateProps.ITEM_STATES];
            console.log(spawners);

            for(let i = 0; i < itemSpawners.length; i++){
                const itemSpawner = itemSpawners[i];
                console.log(itemSpawner);
                console.log(itemSpawner[ItemSpawnerDataProps.TYPE]);
                console.log(spawners[i]);

                spawners[i].setType(itemSpawner[ItemSpawnerDataProps.TYPE]);
                spawners[i].setSpawned(itemSpawner[ItemSpawnerDataProps.SPAWNED]);
            }
        });
    }

    const draw = function() {
        for (let itemSpawner of spawners) {
            itemSpawner.draw();
        }
    }

    const update = function(timestamp) {
        for (let itemSpawner of spawners) {
            itemSpawner.update(timestamp);
        }
    }

    const getItemSpawner = function(idx){
        return spawners[idx];
    }

    const getIsLoaded = function () {
        return isLoaded; 
    };


    return {
        init: init,
        draw: draw,
        update:update,
        getItemSpawner: getItemSpawner,
        getIsLoaded:getIsLoaded,
        loadPromise: loadPromise
    };
})();
/**
 * This module provides a state manager for input events.
 */
const InputStateManager = (function () {
    // Define a reference to the player state listener and the socket
    let socket = null;
    let cv = null;
    let username = null;


    // Helper function to get the key from the event
    function getKeyFromEvent(event) {
        let key;
        if (event.key === 'a' || event.key === 'A') {
            key = Keys.LEFT;
        } else if (event.key === 'd' || event.key === 'D') {
            key = Keys.RIGHT;
        } else if (event.key === 'w' || event.key === 'W') {
            key = Keys.JUMP;
        }
        return key;
    }

    /**
     * Initialize the state manager with the given player state listener and socket
     * @param {Object} params - The player state listener and socket to use
     */
    const init = function ({ socket: _socket, cv: _cv, username: _username }) {
        socket = _socket;
        cv = _cv;
        username = _username;

        $(document).on('keydown', function (event) {
            const key = getKeyFromEvent(event);
            if (!key) return;
            socket.emit(SocketEvents.ON_KEY_DOWN, JSON.stringify({ username, key }));
        });

        $(document).on("keyup", function (event) {
            const key = getKeyFromEvent(event);
            if (!key) return;
            socket.emit(SocketEvents.ON_KEY_UP, JSON.stringify({ username, key }));
        });

        $(document).on('mousemove', function (evt) {
            if (!PlayerStateListener.getIsLoaded()) {
                return; // If the players object has not been populated yet, do not handle the event
            }
            const rect = cv.getBoundingClientRect();
            const mouseX = evt.pageX - rect.left;
            const mouseY = evt.pageY - rect.top;
            const player_self = PlayerStateListener.getPlayer("username");

            const { x: playerX, y: playerY } = player_self.getXY();

            // Calculate the angle between the player and the mouse
            const angle = Math.atan2(mouseY - playerY, mouseX - playerX) * (180.0 / Math.PI);

            socket.emit(SocketEvents.ON_MOUSE_MOVE, JSON.stringify({ username, angle }));
        });
    };

    // Return the public methods
    return {
        init: init
    };
})();
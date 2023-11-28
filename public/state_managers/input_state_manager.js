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
            socket.emit(SocketEvents.ON_KEY_DOWN, JSON.stringify({ [KeyEventProps.USERNAME]: username, [KeyEventProps.KEY]: key }));
        });

        $(document).on("keyup", function (event) {
            const key = getKeyFromEvent(event);
            if (!key) return;
            socket.emit(SocketEvents.ON_KEY_UP, JSON.stringify({ [KeyEventProps.USERNAME]: username, [KeyEventProps.KEY]: key }));
        });

        const handleMouseEvent = function(evt, eventName) {
            const rect = cv.getBoundingClientRect();
            const mouseX = evt.pageX - rect.left;
            const mouseY = evt.pageY - rect.top;
            const player_self = PlayerStateListener.getPlayer(username);
    
            const { x: playerX, y: playerY } = player_self.getXY();
    
            // Calculate the angle between the player and the mouse
            const angle = Math.atan2(mouseY - playerY, mouseX - playerX) * (180.0 / Math.PI);
    
            socket.emit(eventName, JSON.stringify({ username, angle }));
        };
    
        $(document).on('mousemove', function (evt) {
            handleMouseEvent(evt, SocketEvents.ON_MOUSE_MOVE);
        });
    
        $(document).on('mousedown', function (evt) {
            handleMouseEvent(evt, SocketEvents.ON_MOUSE_DOWN);
        });

        $(document).on('mouseup', function (evt) {
            handleMouseEvent(evt, SocketEvents.ON_MOUSE_UP);
        });
    };

    // Return the public methods
    return {
        init: init
    };
})();
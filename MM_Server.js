const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");
const path = require('path');
const {
    SocketEvents, KeyEventProps, MapConsts
} = require('./shared/constants');
const Mutex = require('async-mutex').Mutex;

// utility functions
const { Util } = require("./util/Util");
// queue
const { disconnectableQueue } = require("./util/disconnectableQueue");
// Gamemanager
const { GameManager } = require("./server/game_mechanics/game_manager");

// Create the Express app
const app = express();
// Use the 'public' folder to serve static files

app.use(express.static(path.join(__dirname, 'public')));
app.use('/shared', express.static(path.join(__dirname, 'shared')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'metal_mayhem.html'));
});// Use the json middleware to parse JSON data
// Use the json middleware to parse JSON data
app.use(express.json());

// Use the session middleware to maintain sessions
const MM_Session = session({
    secret: "game",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: { maxAge: 300000 }
});
app.use(MM_Session);

// Sockets
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Socket } = require("dgram");

const httpServer = createServer(app);
const io = new Server(httpServer);
// Ask Socket io to use existing session
io.use((socket, next) => { MM_Session(socket.request, {}, next); });

// List of online users
const onlineUsers = {};
// Player queue
const playerQueue = disconnectableQueue();
// Tracks on-going games key = game id, value = GameManager
const onGoingGames = {}
// Track the games that online users are in. Key = username, value = game id
const usersToGames = {}

// Max number of games
const maxNumGames = 3;

// The largest number that could be used as an ID for a game
const maxID = 1024;

// dictionary of all maps, array of all maps and mapinfos
// for if we have multiple maps
//const mapPool = JSON.parse(fs.readFileSync("data/maps.json"));

// for only one map
// TODO: add platforms, items (spawn location and spawn time after being picked up), initial player position and directions here.
const mapInfo = {
    platforms: MapConsts.PLATFORMS,
    items: [{ spawnlocation: { x: 0, y: 0 }, time: 20 }],
    initialPlayerLocations: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
    initialPlayerDirections: [{ x: 0, y: 0 }, { x: 0, y: 0 }],
}

// mutex for accessing queue
const queue_mutex = new Mutex();
const ready_mutex = new Mutex();

// Handles registration
// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Helper function for removing players from queue on signout or disconnect, or manually leaving the queue
// playerToRemove = username of player to remove
function removeFromQueue(playerToRemove) {
    console.log("remove from queue called");
    playerQueue.removeFromQueue(playerToRemove);
}

// Helper function to disconnect player from an on-going game when signout or disconnected or leaving the game
// playerToRemove = username of player to remove
function removeFromGame(playerToRemove) {
    // if player is in a game
    if (playerToRemove in usersToGames) {
        let gameID = usersToGames[playerToRemove];
        let game = onGoingGames[gameID];

        // returns the updated profile of the player
        let opponent = game.disconnectPlayer(playerToRemove);
        delete usersToGames[playerToRemove];
        delete usersToGames[opponent];

        // player's profile was updated during gameplay, save it into users file
        /*
        const users = JSON.parse(fs.readFileSync("data/users.json"));
        fs.writeFileSync("data/users.json", JSON.stringify(users, null, "   "));
        */
    }
}

// Helper function to check whether a new game can be created.
function canCreateGame() {
    return Object.keys(onGoingGames).length < maxNumGames && playerQueue.numOfQueuedPlayers() >= 2;
}

// Helper function for creating a gameID
function createGameID() {
    return Util.generateID(onGoingGames);
}

// Helper function for creating a match between two players 
function createGame() {
    // create as many games as needed
    console.log("canCreateGame: " + canCreateGame());
    while (canCreateGame()) {
        console.log("creating game")

        // dequeue the two users
        let account1 = playerQueue.dequeue();
        let account2 = playerQueue.dequeue();

        // get the sockets of the two users
        let socket1 = onlineUsers[account1.username].socket;
        let socket2 = onlineUsers[account2.username].socket;

        let sockets = {};
        sockets[account1.username] = socket1;
        sockets[account2.username] = socket2;

        /*
        // for multiple maps
        // select random map from map pool
        let mapID = Math.floor(Object.keys(mapPool).length * Math.random());
        let mapInfo = mapPool[mapID];
        */

        // Initialize game
        let gameID = createGameID();
        let game = GameManager(gameID, io);

        onGoingGames[gameID] = game;
        usersToGames[account1.username] = gameID;
        usersToGames[account2.username] = gameID;

        game.initialize(account1, account2, mapInfo, sockets, game, () => {
            // call back function on gameover.
            const users = JSON.parse(fs.readFileSync("data/users.json"));

            users[account1.username].profile = account1.profile;
            users[account2.username].profile = account2.profile;

            fs.writeFileSync("data/users.json", JSON.stringify(users, null, "   "));
        });
    }
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    console.log(users);

    let data_correct = true;

    if (username == "" || avatar == "" || name == "" || password == "") {
        res.json({ status: "error", error: "Username, avatar, name or password is empty!" });
        data_correct = false;
    }
    else if (!containWordCharsOnly(username)) {
        res.json({ status: "error", error: "Username can only contain underscores, letters or numbers!" });
        data_correct = false;
    }
    else if (username in users) {
        res.json({ status: "error", error: "Username already in use! Please pick another username!" });
        data_correct = false;
    }

    if (data_correct) {
        //
        // G. Adding the new user account with new profile
        //
        const hash = bcrypt.hashSync(password, 10);
        users[username] = {
            "avatar": avatar, "name": name, "password": hash,
            "profile": {
                "Wins": 0,
                "Losses": 0,
                "Kills": 0,
                "Deaths": 0,
                "GamesPlayed": 0,
            }
        };

        fs.writeFileSync("data/users.json", JSON.stringify(users, null, "   "));
        res.json({ status: "success" });
    }
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    console.log(users);

    let can_sign_in = true;

    if (!(username in users)) {
        res.json({ status: "error", error: "Username not found!" });
        can_sign_in = false;
    }
    else {
        const hash = users[username]["password"];
        if (!bcrypt.compareSync(password, hash)) {
            res.json({ status: "error", error: "Incorrect password!" });
            can_sign_in = false;
        }
    }

    if (can_sign_in) {
        let account = JSON.stringify({
            username: username,
            avatar: users[username]["avatar"],
            name: users[username]["name"],
            profile: users[username]["profile"]
        });

        req.session.user = account;
        res.json({ status: "success", account });
    }
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
    const account = req.session.user;

    if (account == null) {
        res.json({ status: "error", error: "No user signed in!" });
    }
    else {
        res.json({ status: "success", account });
    }
});

// Handle the /signout endpoint
app.get("/signout", (req, res) => {
    console.log("sign out");

    // remove user in queue or any ongoing games.
    playerToRemove = JSON.parse(req.session.user).username;

    // acquire mutex for accessing the queue
    queue_mutex.acquire().then((release) => {
        removeFromQueue(playerToRemove);
        removeFromGame(playerToRemove);

        release();
    });

    req.session.user = null;
    res.json({ status: "success" });
});

// Get profile
app.get("/profile", (req, res) => {
    const account = req.session.user;

    if (account == null) {
        res.json({ status: "error", error: "No user signed in!" });
    }
    else {
        res.json({ status: "success", profile: account.profile });
    }
})

// Adding a user on connection
io.on("connection", (socket) => {
    console.log("connection test");

    let account = JSON.parse(socket.request.session.user);
    console.log(socket.request.session.user);

    onlineUsers[account.username] = {
        avatar: account.avatar,
        name: account.name,
        profile: account.profile,
        socket: socket
    };


    // notify others that a user connected.
    //io.emit("add user", JSON.stringify(account));

    // Removing a user on disconnect
    socket.on(SocketEvents.DISCONNECT, () => {
        console.log("disconnection test");
        let account = JSON.parse(socket.request.session.user);
        playerToRemove = account.username;
        delete onlineUsers[account.username];


        // acquire mutex to access player queue
        queue_mutex.acquire().then((release) => {
            // remove player from queue if player is in queue
            if (playerQueue.inQueue(playerToRemove)) {
                removeFromQueue(playerToRemove);
            }

            removeFromGame(playerToRemove);

            // release mutex for accessing queue.
            release();
        });

    });

    // Joining a queue
    socket.on(SocketEvents.JOIN_QUEUE, () => {
        console.log("joining queue " + socket.request.session.user);
        let account = JSON.parse(socket.request.session.user);

        // acquire mutex for accessing the queue
        queue_mutex.acquire().then((release) => {
            // queue player up if they can join a queue
            if (!playerQueue.inQueue(account.username)) {
                playerQueue.enqueue(account);

                // check if a new match can be created, if so, create a new match and have the dequeued players join it.
                createGame();

                // if the player didn't make it into a game, send an event notifying the client that they are queued.
                if (!(account.username in usersToGames)) {
                    console.log("not in game!");
                    socket.emit(SocketEvents.JOINED_QUEUE, JSON.stringify(playerQueue.numOfQueuedPlayers()));
                }
            }
            // release the mutex
            release();
        });

    });

    // leave a queue
    socket.on(SocketEvents.LEAVE_QUEUE, () => {
        console.log("leaving queue " + socket.request.session.user);

        // acquire mutex for accessing queue
        queue_mutex.acquire().then((release) => {
            // remove player from queue if player is in queue
            let account = JSON.parse(socket.request.session.user);
            let playerToRemove = account.username;

            console.log(playerToRemove);

            if (playerQueue.inQueue(playerToRemove)) {
                playerQueue.removeFromQueue(playerToRemove);
            }

            // release mutex for accessing queue.
            release();
        });

        socket.emit(SocketEvents.LEFT_QUEUE);

    });

    // sent by a client who is done loading a level
    socket.on(SocketEvents.READY, () => {

        // find the game that the user belongs to and tell the corresponding gamemanager
        // that they are ready to start the game.
        console.log("socket on ready");

        ready_mutex.acquire().then((release) => {
            let account = JSON.parse(socket.request.session.user);
            let username = account.username;


            if (username in usersToGames) {
                let gameID = usersToGames[username];
                let game = onGoingGames[gameID];

                game.ready(username);
            }

            release();
        });


    });

    // Processes key down event
    socket.on(SocketEvents.ON_KEY_DOWN, (action) => {
        let account = JSON.parse(socket.request.session.user);
        let username = account.username;
        // if user is in a game
        if (action[KeyEventProps.USERNAME] == action.username) {

            if (username in usersToGames) {

                // find the game the user is in
                let gameID = usersToGames[username];
                let game = onGoingGames[gameID];

                // ask the corresponding gamemanager to process the action from the user
                game.processKeyDown(action);
            }

        }

    });

    // Processes key up event
    socket.on(SocketEvents.ON_KEY_UP, (action) => {

        let account = JSON.parse(socket.request.session.user);
        let username = account.username;
        if (action[KeyEventProps.USERNAME] == action.username) {
            // if user is in a game
            if (username in usersToGames) {

                // find the game the user is in
                let gameID = usersToGames[username];
                let game = onGoingGames[gameID];

                // ask the corresponding gamemanager to process the action from the user
                game.processKeyUp(action);
            }
        }

    });

    socket.on(SocketEvents.ON_MOUSE_MOVE, (action) => {

        let account = JSON.parse(socket.request.session.user);
        let username = account.username;
        if (action[KeyEventProps.USERNAME] == action.username) {
            // if user is in a game
            if (username in usersToGames) {

                // find the game the user is in
                let gameID = usersToGames[username];
                let game = onGoingGames[gameID];

                // ask the corresponding gamemanager to process the action from the user
                game.processMouseMove(action);
            }
        }

    });

    socket.on(SocketEvents.ON_MOUSE_DOWN, (action) => {

        let account = JSON.parse(socket.request.session.user);
        let username = account.username;
        if (action[KeyEventProps.USERNAME] == action.username) {
            // if user is in a game
            if (username in usersToGames) {

                // find the game the user is in
                let gameID = usersToGames[username];
                let game = onGoingGames[gameID];

                // ask the corresponding gamemanager to process the action from the user
                game.processMouseDown(action);
            }
        }

    });

    socket.on(SocketEvents.ON_MOUSE_UP, (action) => {

        let account = JSON.parse(socket.request.session.user);
        let username = account.username;
        if (action[KeyEventProps.USERNAME] == action.username) {
            // if user is in a game
            if (username in usersToGames) {

                // find the game the user is in
                let gameID = usersToGames[username];
                let game = onGoingGames[gameID];

                // ask the corresponding gamemanager to process the action from the user
                game.processMouseUp(action);
            }
        }

    });

    // Make the player leave a game
    socket.on(SocketEvents.LEAVE_GAME, () => {
        let account = JSON.parse(socket.request.session.user);
        let username = account.username;

        // acquire mutex to access player queue
        queue_mutex.acquire().then((release) => {
            removeFromGame(username);
            // release mutex for accessing queue.
            release();
        });

        socket.emit(SocketEvents.LEFT_GAME);
    });

    // Rematch
    socket.on(SocketEvents.REMATCH, () => {
        let account = JSON.parse(socket.request.session.user);
        let username = account.username; 

        // acquire mutex to access player queue
        queue_mutex.acquire().then((release) => {
            let account = JSON.parse(socket.request.session.user);
            let username = account.username;


            if (username in usersToGames) {
                let gameID = usersToGames[username];
                let game = onGoingGames[gameID];

                game.requestRematch(username);
            }

            release();
        });
    });
});




// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});


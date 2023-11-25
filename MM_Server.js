const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const session = require("express-session");
const disconnectableQueue = require('./util/disconnectableQueue');
const path = require('path');

const Mutex = require('async-mutex').Mutex;
const Semaphore = require('async-mutex').Semaphore;
const withTimeout = require('async-mutex').withTimeout;
// Create the Express app
const app = express();
// Use the 'public' folder to serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
res.sendFile(path.join(__dirname, 'public', 'metal_mayhem.html'));
});// Use the json middleware to parse JSON data
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
const {createServer} = require("http");
const {Server} = require("socket.io");
const { Socket } = require("dgram");

const httpServer = createServer(app);
const io = new Server(httpServer);
// Ask Socket io to use existing session
io.use((socket, next) => {MM_Session(socket.request, {}, next);});

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
// TODO: add platforms, items, initial player position and directions here.
const mapInfo = {}

// mutex for accessing queue
const queue_mutex = new Mutex();

// Handles registration
// This helper function checks whether the text only contains word characters
function containWordCharsOnly(text) {
    return /^\w+$/.test(text);
}

// Helper function for removing players from queue on signout or disconnect, or manually leaving the queue
// playerToRemove = username of player to remove
function removeFromQueue(playerToRemove){
    playerQueue.removeFromQueue(playerToRemove);
}

// Helper function to disconnect player from an on-going game when signout or disconnected or leaving the game
// playerToRemove = username of player to remove
function removeFromGame(playerToRemove){
    // if player is in a game
    if(playerToRemove in usersToGames){
        let gameID = usersToGames[playerToRemove];
        let game = onGoingGames[gameID];

        // returns the updated profile of the player
        let profile = game.disconnectPlayer(playerToRemove).profile;
        delete usersToGames[playerToRemove];

        // player's profile was updated during gameplay, save it into users file
        const users = JSON.parse(fs.readFileSync("data/users.json"));
        users[playerToRemove].profile = profile;
        fs.writeFileSync("data/users.json", JSON.stringify(users, null, "   "));
    }
}

// Helper function to check whether a new game can be created.
function canCreateGame(){
    return playerQueue.numOfQueuedPlayers() < maxNumGames && playerQueue.numOfQueuedPlayers() > 2;
}

// Helper function for creating a gameID
function createGameID(){
    let gameID = Math.floor(maxID * Math.random());
    while(gameID in onGoingGames){
        gameID = Math.floor(maxID * Math.random());
    }
    return gameID;
}

// Helper function for creating a match between two players 
function createGame(){
    // create as many games as needed
    while(canCreateGame()){

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
        
        game.initialize(account1, account2, mapInfo, sockets);


        // Add games to on going games and users to userstogames
        onGoingGames[gameID] = game;
        usersToGames[account1.username] = gameID;
        usersToGames[account2.username] = gameID;
    }
}

// Handle the /register endpoint
app.post("/register", (req, res) => {
    // Get the JSON data from the body
    const { username, avatar, name, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    console.log(users);

    let data_correct = true;

    if(username == "" || avatar == "" || name == "" || password == ""){
        res.json({status:"error", error:"Username, avatar, name or password is empty!"});
        data_correct = false;
    }
    else if(!containWordCharsOnly(username)){
        res.json({status:"error", error:"Username can only contain underscores, letters or numbers!"});
        data_correct = false;
    }
    else if(username in users){
        res.json({status:"error", error:"Username already in use! Please pick another username!"});
        data_correct = false;
    }

    if(data_correct){
        //
        // G. Adding the new user account with new profile
        //
        const hash = bcrypt.hashSync(password, 10);
        users[username] = {"avatar" : avatar, "name" : name, "password" : hash, 
        "profile" : {
            "Wins" : 0,
            "Losses" : 0,
            "Kills" : 0,
            "Deaths" : 0,
            "GamesPlayed" : 0,
        }};

        fs.writeFileSync("data/users.json", JSON.stringify(users, null, "   "));
        res.json({status:"success"});
    }
});

// Handle the /signin endpoint
app.post("/signin", (req, res) => {
    // Get the JSON data from the body
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync("data/users.json"));
    console.log(users);

    let can_sign_in = true;

    if(!(username in users)){
        res.json({status:"error", error:"Username not found!"});
        can_sign_in = false;
    }
    else{
        const hash = users[username]["password"];
        if(!bcrypt.compareSync(password, hash)){
            res.json({status:"error", error:"Incorrect password!"});
            can_sign_in = false;
        }
    }
    
    if(can_sign_in){
        let account = JSON.stringify({
            username: username, 
            avatar: users[username]["avatar"], 
            name : users[username]["name"], 
            profile : users[username]["profile"]});

        req.session.user = account;
        res.json({status: "success", account});
    }
});

// Handle the /validate endpoint
app.get("/validate", (req, res) => {
    const account = req.session.user;

    if(account == null){
        res.json({status:"error", error:"No user signed in!"});
    }
    else{
        res.json({status:"success", account});
    }
});

// Handle the /signout endpoint
app.post("/signout", (req, res) => {

    // remove user in queue or any ongoing games.
    playerToRemove = JSON.parse(req.session.user).username;

    // acquire mutex for accessing the queue
    queue_mutex.acquire().then((release) => {
        removeFromQueue(playerToRemove);
        removeFromGame(playerToRemove);

        release();
    });

    req.session.user = null;
    res.json({status:"success"});
});

// Get profile
app.get("/profile", (req, res) => {
    const account = req.session.user;

    if(account == null){
        res.json({status:"error", error:"No user signed in!"});
    }
    else{
        res.json({status:"success", profile: account.profile});
    }
})

// Adding a user on connection
io.on("connection", (socket) => {
    console.log("connection test");
    let account = JSON.parse(socket.request.session.user);

    onlineUsers[account.username] = {
        avatar: account.avatar, 
        name: account.name, 
        profile: account.profile, 
        socket: socket};

    // notify others that a user connected.
    //io.emit("add user", JSON.stringify(account));

    // Removing a user on disconnect
    socket.on("disconnect", () => {
        console.log("disconnection test");
        let account = JSON.parse(socket.request.session.user);
        playerToRemove = account.username;
        delete onlineUsers[account.username];

        // acquire mutex to access player queue
        queue_mutex.acquire().then((release) => {
            // remove player from queue if player is in queue
            if(playerQueue.inQueue(playerToRemove)){
                removeFromQueue(playerToRemove);
            }

            removeFromGame(playerToRemove);

            // release mutex for accessing queue.
            release();
        });
    });

    // Joining a queue
    socket.on("join queue", () => {
        let account = JSON.parse(socket.request.session.user);

        // acquire mutex for accessing the queue
        queue_mutex.acquire().then((release) => {
            // queue player up if they can join a queue
            if(!playerQueue.inQueue(account.username)){
                playerQueue.enqueue(account);
    
                // check if a new match can be created, if so, create a new match and have the dequeued players join it.
                createGame();

                // if the player didn't make it into a game, send an event notifying the client that they are queued.
                if(!(account.username in usersToGames)){
                    socket.emit("joined queue", JSON.stringify(playerQueue.numOfQueuedPlayers()));
                }
            }
            // release the mutex
            release();
        });

    });

    // leave a queue
    socket.on("leave queue", () => {
        let account = JSON.parse(socket.request.session.user);
        let playerToRemove = account.username;

        // acquire mutex for accessing queue
        queue_mutex.acquire().then((release) => {
            // remove player from queue if player is in queue
            if(playerQueue.inQueue(playerToRemove)){
                playerQueue.removeFromQueue();
            }

            // release mutex for accessing queue.
            release();
        });

        socket.emit("left queue");

    });

    // sent by a client who is done loading a level
    socket.on("ready", () => {

        // find the game that the user belongs to and tell the corresponding gamemanager
        // that they are ready to start the game.

        let account = JSON.parse(socket.request.session.user);
        let username = account.username;

        if(username in usersToGames){
            let gameID = usersToGames[username];
            let game = onGoingGames[gameID];

            game.ready(username);
        }

    });

    // Processes key down event
    socket.on("on keydown", (action) => {
        
        let account = JSON.parse(socket.request.session.user);
        let username = account.username;

        // if user is in a game
        if(username in usersToGames){

            // find the game the user is in
            let gameID = usersToGames[username];
            let game = onGoingGames[gameID];

            // ask the corresponding gamemanager to process the action from the user
            game.processKeyDown(username, action);
        }

    });

    // Processes key up event
    socket.on("on keyup", (action) => {
        
        let account = JSON.parse(socket.request.session.user);
        let username = account.username;

        // if user is in a game
        if(username in usersToGames){

            // find the game the user is in
            let gameID = usersToGames[username];
            let game = onGoingGames[gameID];

            // ask the corresponding gamemanager to process the action from the user
            game.processKeyUp(username, action);
        }

    });

    // Make the player leave a game
    socket.on("leave game", () => {
        let account = JSON.parse(socket.request.session.user);
        let username = account.username;

        // acquire mutex to access player queue
        queue_mutex.acquire().then((release) => {
            removeFromGame(playerToRemove);

            // release mutex for accessing queue.
            release();
        });

        socket.emit("left game");
    });
});


// Use a web server to listen at port 8000
httpServer.listen(8000, () => {
    console.log("The chat server has started...");
});


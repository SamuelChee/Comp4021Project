const {LinkedList, LinkedListNode} = require("./linkedList");

const disconnectableQueue = function(){
    const queue = LinkedList();
    const queuedPlayers = {};

    const enqueue = function(account){
        // account should have the username, avatar, name, profile
        if(!(account.username in queuedPlayers)){
            queuedPlayers[account.username] = {
                name: account.name, 
                avatar: account.avatar,
                profile: account.profile};

            queue.addNode(account.username);
        }    
        console.log(numOfQueuedPlayers());
    };

    const dequeue = function(){
        // remove player from queue
        user = queue.removeNode();
        console.log(user);
        console.log(typeof(user));
        // Get account information back
        let account = {
            username: user, 
            name: queuedPlayers[user].name, 
            avatar: queuedPlayers[user].avatar, 
            profile: queuedPlayers[user].profile};
            
        // remove from queuedplayer list
        delete queuedPlayers[user];

        console.log(numOfQueuedPlayers());

        return account;
    };

    // handle cases when the player decides to leave the queue or disconnected while in queue
    const removeFromQueue = function(playerToRemove){
        console.log("remove from queue called");
        console.log("Queued players " + Object.keys(queuedPlayers));
        console.log("Player to remove: " + playerToRemove);

        if(playerToRemove in queuedPlayers){
            console.log("Removing queue");
            queue.removeElement(playerToRemove);
            delete queuedPlayers[playerToRemove];
        }
        console.log(numOfQueuedPlayers());
    };

    const peak = function(){
        return queue.peak();
    };

    const numOfQueuedPlayers = function(){
        return queue.getCount();
    }

    const inQueue = function(user){
        return (user in queuedPlayers);
    }

    return {enqueue, dequeue, removeFromQueue, peak, numOfQueuedPlayers, inQueue};
};

if(typeof(module) === "object")
    module.exports = {disconnectableQueue};
const disconnectableQueue = function(){
    const queue = LinkedList();
    const queuedPlayers = {};

    const enqueue = function(account){
        // account should have the username, avatar, name, profile
        if(!(account.username in queuedPlayer)){
            queuedPlayers[account.username] = {
                name: account.name, 
                avatar: account.avatar,
                profile: account.profile};

            let newNode = LinkedListNode;
            newNode.initialize(account.username);
            queue.addNode(newNode);
        }    
    };

    const dequeue = function(){
        // remove player from queue
        user = queue.removeNode();
        // Get account information back
        let account = {
            username: user, 
            name: queuedPlayers[user].name, 
            avatar: queuedPlayers[user].avatar, 
            profile: queuedPlayers[user].profile};
            
        // remove from queuedplayer list
        delete queuedPlayers[user];

        return account;
    };

    // handle cases when the player decides to leave the queue or disconnected while in queue
    const removeFromQueue = function(playerToRemove){
        if(playerToRemove in queuedPlayers){
            queue.removeElement(user);
            delete queuedPlayers[user];
        }
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
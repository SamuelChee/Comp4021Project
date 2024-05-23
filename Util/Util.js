const Util = function(){

    // generates a random ID that is not in o
    const generateID = function(o, max=1024){
        let id = Math.floor(max * Math.random());

        while(id in o){
            id = Math.floor(max * Math.random());
        }

        return id;
    }

    return {generateID};

}();

if(typeof(module) === "object")
    module.exports = {Util};
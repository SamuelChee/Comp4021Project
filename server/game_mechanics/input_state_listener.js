const {
  Directions,
  Keys,
  Actions,
  PlayerStateProps,
  PlatformDataProps,
  LoadLevelProps,
  ServerUpdateProps,
  PlayerConsts
} = require('../../shared/constants');


const InputStateListener = function(manager) {

    const playerKeyStates = {};
    const playerAimAngles = {};

    let gameManager = manager;
    
    const initUserKeystate = (username) => {
      playerKeyStates[username] = {
        curKeyState: {},
      };
    }

    const initUserAimAngle = (username) => {
      playerAimAngles[username] = 0;
    }
  
    const updateKeyUp = (username, key) => {
      // key = key.toLowerCase();
      
      if(!playerKeyStates[username]) {
        initUserKeystate(username);
      }
      
      playerKeyStates[username].curKeyState[key] = false;
    }
  
    const updateKeyDown = (username, key) => {
    //   if (typeof key === 'string') {
    //     // key = key.toLowerCase();
    // } else {
    //     console.error("TypeError: key is not a string. Actual type: ", typeof key);
    // }
    // console.log("After toLowerCase key: ", key);
      
      if(!playerKeyStates[username]) {
        initUserKeystate(username);
      }
      
      playerKeyStates[username].curKeyState[key] = true;
    }

    const updateAimAngle = (username, angle) => {
      
      if(!playerAimAngles[username]) {
        initUserAimAngle(username);
      }
      playerAimAngles[username] = angle;
    }
  
    const getKeyPressed = (username, key) => {
      // key = key.toLowerCase();
      
      if(!playerKeyStates[username] || !playerKeyStates[username].curKeyState) {
        return false;
      }
      return !!playerKeyStates[username].curKeyState[key];
    }

    const getAimAngle = (username) => {
      
      if(!playerAimAngles[username]) {
        return 0;
      }
      
      return playerAimAngles[username];
    }

    
  
 
    return {
      updateKeyUp,
      updateKeyDown,
      updateAimAngle,
      getKeyPressed,
      getAimAngle
    }
  
  };
  
  module.exports = {InputStateListener};
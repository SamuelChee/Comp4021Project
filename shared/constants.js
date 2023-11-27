// Enum for direction of movement
const Directions = Object.freeze({
  LEFT: 'left_dir',   // Indicates left direction
  RIGHT: 'right_dir'  // Indicates right direction
});

// Enum for keys used in player input
const Keys = Object.freeze({
  LEFT: 'left_key',   // Indicates the key for moving left
  RIGHT: 'right_key', // Indicates the key for moving right
  JUMP: 'jump_key'    // Indicates the key for jumping
});

// Enum for the possible actions a player can perform
const Actions = Object.freeze({
  IDLE: 'idle_action',  // Indicates the player is idle
  MOVE: 'move_action'   // Indicates the player is moving
});

// Enum for the properties of the player's state
const PlayerStateProps = Object.freeze({
  X_INI: 'x_ini',                       // Initial X coordinate
  Y_INI: 'y_ini',                       // Initial Y coordinate
  X: 'x',                               // Current X coordinate
  Y: 'y',                               // Current Y coordinate
  X_VEL: 'xVel',                        // X Velocity
  ACTION: 'action',                     // Current action
  DIRECTION: 'direction',               // Current direction
  AIM_ANGLE: 'aimAngle',                // Aiming angle
  Y_VEL: 'yVel',                        // Y Velocity
  TERMINAL_Y_VEL: 'terminalYVel',       // Terminal Y Velocity
  JUMP_VEL: 'jumpVel',                  // Jump Velocity
  GRAVITATIONAL_ACC: 'gravitationalAcceleration',  // Gravitational Acceleration
  IS_FALLING: 'isFalling',              // Flag for falling state
  X_DIRECTION_MULTIPLE: 'xDirectionMultiple',  // X Direction Multiple
  WEP_ID: 'wepID'                       // Weapon ID
});
const MapStateProps = {
  PLATFORMS: 'platforms',                         
  ITEMS: 'items',                               
  INI_PLAYER_LOCS: 'initialPlayerLocations',                             
  INI_PLAYER_DIRS: 'initialPlayerDirections'       
};
// Enum for the properties of the platform's data
const PlatformDataProps = {
  TYPE: 'type',                         // Type of platform
  X: 'x',                               // X coordinate of platform
  Y: 'y',                               // Y coordinate of platform
  NUM_PLATFORMS: 'num_platforms'        // Number of platforms
};

const LoadLevelProps = {
  GAME_ID: 'gameID',                         
  PLAYER_STATES: 'playerStates',                               
  MAP_STATE: 'mapState'                        
};

const ServerUpdateProps = {
  PLAYER_STATES: 'playerStates'                      
};

const KeyEventProps = {
  USERNAME: 'username',
  KEY: 'key'                      
};

const MouseEventProps = {
  USERNAME: 'username',
  Angle: 'angle'                      
};




// Check the environment and set global variables accordingly
if (typeof window !== 'undefined') {
  // Running in a browser
  // Set the Enums as global variables
  window.Directions = Directions;
  window.Keys = Keys;
  window.Actions = Actions;
  window.PlayerStateProps = PlayerStateProps;
  window.PlatformDataProps = PlatformDataProps;
  window.LoadLevelProps = LoadLevelProps;
  window.ServerUpdateProps = ServerUpdateProps;
  window.KeyEventProps = KeyEventProps;
  window.MouseEventProps = MouseEventProps;
  window.MapStateProps = MapStateProps;

} else {
  // Running in Node.js
  // Export the Enums for use in other modules
  module.exports = {
    Directions,
    Keys,
    Actions,
    PlayerStateProps,
    PlatformDataProps,
    LoadLevelProps,
    ServerUpdateProps,
    KeyEventProps,
    MouseEventProps,
    MapStateProps
  };
}
// Enum for direction of movement
const Directions = Object.freeze({
  LEFT: 'left_dir',   // Indicates left direction
  RIGHT: 'right_dir'  // Indicates right direction
});

// Enum for keys used in player input
const Keys = Object.freeze({
  LEFT: 'left_key',   // Indicates the key for moving left
  RIGHT: 'right_key', // Indicates the key for moving right
  JUMP: 'jump_key',    // Indicates the key for jumping
  SHOOT: 'mouse_key',
  CHEAT: 'cheat_key',
  EQUIP: 'equip_key'
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
  WEP_ID: 'wepID',                       // Weapon ID
  AMMO: 'ammo',                          // ammo left
  BOX: "box",
  PLATFORM_IDX: "platform_idx",
  HEALTH: "health",
  CAN_EQUIP: "can_equip"
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


const ItemType = {
  WEP: "wep",
  AMMO: "ammo",
  HEALTH: "health"
}
const ItemSpawnerDataProps = {
  X: 'x',
  Y: 'y',
  TYPE: 'type',
  SPAWNED: 'Spawned',
  CAN_SPAWN: 'can_spawn',
  BOX: 'box',
  TIME: 'time',
  WEP_ID: 'wep_id', // 0 - 7
  AMMO_COUNT: 'ammo_count', //20-60
  HEALTH_COUNT: 'health_count' //20 - 60
};

const LoadLevelProps = {
  GAME_ID: 'gameID',
  PLAYER_STATES: 'playerStates',
  MAP_STATE: 'mapState'
};

const ServerUpdateProps = {
  PLAYER_STATES: 'playerStates',
  BULLET_STATES: 'bulletStates',
  ITEM_STATES: 'itemStates'
};

const KeyEventProps = {
  USERNAME: 'username',
  KEY: 'key'
};

const MouseEventProps = {
  USERNAME: 'username',
  ANGLE: 'angle'
};
const WepIds = {
  WEP_0: 0,
  WEP_1: 1,
  WEP_2: 2,
  WEP_3: 3,
  WEP_4: 4,
  WEP_5: 5,
  WEP_6: 6,
  WEP_7: 7
};

const BulletTypes = {
  PURPLE: "purple",
  YELLOW: "yellow",
  BLUE: "blue",
  RED: "red",
  RECT_RED: "rectangular_red",
  THIN_GREEN: "thin_green",
  CIRC_PINK: "circular_pink",
  THIN_BLUE: "thin_blue",
  CIRC_ORANGE: "circular_orange"
};
const WepProps = {
  [WepIds.WEP_0]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5, // converted to milliseconds
    BULLET_TYPE: BulletTypes.PURPLE
  },
  [WepIds.WEP_1]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5,
    BULLET_TYPE: BulletTypes.YELLOW
  },
  [WepIds.WEP_2]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5,
    BULLET_TYPE: BulletTypes.BLUE
  },
  [WepIds.WEP_3]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5,
    BULLET_TYPE: BulletTypes.RED
  },
  [WepIds.WEP_4]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5,
    BULLET_TYPE: BulletTypes.RECT_RED
  },
  [WepIds.WEP_5]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5,
    BULLET_TYPE: BulletTypes.THIN_GREEN
  },
  [WepIds.WEP_6]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5,
    BULLET_TYPE: BulletTypes.CIRC_PINK
  },
  [WepIds.WEP_7]: {
    SPRITE_SCALE: 1.7,
    INI_AMMO: 100,
    FIRE_RATE: 1000 / 5,
    BULLET_TYPE: BulletTypes.THIN_BLUE
  }
};

const PlayerConsts = {
  SPRITE_WIDTH: 32,
  SPRITE_HEIGHT: 32,
  INI_HP: 100,
  PLAYER_1_INI_X: 50,
  PLAYER_1_INI_Y: 430,
  PLAYER_2_INI_X: 100,
  PLAYER_2_INI_Y: 100,
  PLAYER_1_INI_DIR: Directions.RIGHT,
  PLAYER_2_INI_DIR: Directions.LEFT,
  PLAYER_1_INI_WEP_ID: WepIds.WEP_1,
  PLAYER_2_INI_WEP_ID: WepIds.WEP_0
};



const BulletStateProps = {
  ID: 'id',
  BULLET_TYPE: "bullet_type",
  USERNAME: 'username',
  X: 'x',
  Y: 'y',
  DIRECTION: 'direction',
  SPEED: 'speed',
  IS_ACTIVE: 'is_actiuve'
};

const BulletProps = {
  [BulletTypes.PURPLE]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 20,
    HEIGHT: 12
  },
  [BulletTypes.YELLOW]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 20,
    HEIGHT: 12
  },
  [BulletTypes.BLUE]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 20,
    HEIGHT: 12
  },
  [BulletTypes.RED]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 20,
    HEIGHT: 12
  },
  [BulletTypes.RECT_RED]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 20,
    HEIGHT: 14
  },
  [BulletTypes.THIN_GREEN]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 14,
    HEIGHT: 6
  },
  [BulletTypes.CIRC_PINK]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 10,
    HEIGHT: 10
  },
  [BulletTypes.THIN_BLUE]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 14,
    HEIGHT: 5
  },
  [BulletTypes.CIRC_ORANGE]: {
    DAMAGE: 5,
    SPRITE_SCALE: 1.3,
    SPEED: 10,
    OFFSET: 30,
    WIDTH: 10,
    HEIGHT: 10
  }
};

// const WeaponIdToBulletType = {
//   0: BulletTypes.PURPLE,
//   1: BulletTypes.YELLOW,
//   2: BulletTypes.BLUE,
//   3: BulletTypes.RED,
//   4: BulletTypes.RECT_RED,
//   5: BulletTypes.THIN_GREEN,
//   6: BulletTypes.CIRC_PINK,
//   7: BulletTypes.THIN_BLUE
//   // 9: BulletTypes.CIRC_ORANGE,
//   // Add more mappings as required
// };
let ITEM_Y_OFFESET = 28;
let ITEM_X_OFFSET = 95;
const MapConsts = {
  MAP_WIDTH: 32,
  MAP_HEIGHT: 32,
  PLATFORM_WIDTH: 210,
  PLATFORM_HEIGHT: 32,
  ITEM_WIDTH: 32,
  ITEM_HEIGHT: 32,
  ITEM_WIDTH: 32,
  ITEM_HEIGHT: 32,
  ITEM_SPAWN_TIME: 3500,
  ITEM_SPAWN_TIMEOUT: 2500,
  PLATFORMS: [
    { type: "thick", x: 17, y: 400, num_platforms: 7 },
    { type: "thick", x: 635, y: 400, num_platforms: 7 },
    { type: "thick", x: 335, y: 400 - 100, num_platforms: 7 },
    { type: "thick", x: 17, y: 400 - 100 * 2, num_platforms: 7 },
    { type: "thick", x: 635, y: 400 - 100 * 2, num_platforms: 7 },
    { type: "thick", x: 335, y: 400 - 100 * 3, num_platforms: 7 }
  ],
  ITEMS: [
    { probability: 0.25, x: 17 + ITEM_X_OFFSET, y: 400 - ITEM_Y_OFFESET},
    { probability: 0.5, x: 635 + ITEM_X_OFFSET, y: 400 - ITEM_Y_OFFESET},
    { probability: 0.4, x: 335 + ITEM_X_OFFSET, y: 400 - 100 - ITEM_Y_OFFESET},
    { probability: 0.7, x: 17 + ITEM_X_OFFSET, y: 400 - 100 * 2 - ITEM_Y_OFFESET},
    { probability: 0.3, x: 635 + ITEM_X_OFFSET, y: 400 - 100 * 2 - ITEM_Y_OFFESET},
    { probability: 0.3, x: 335 + ITEM_X_OFFSET, y: 400 - 100 * 3 - ITEM_Y_OFFESET}

  ]
};
// { type: "thick", x: 17, y: 400, num_platforms: 7 }

const SocketEvents = {
  CONNECT: "connect",
  CONNECT_ERROR: "connect_error",
  DISCONNECT: "disconnect",
  JOIN_QUEUE: "join_queue",
  JOINED_QUEUE: "joined_queue",
  LEAVE_QUEUE: "leave_queue",
  LEFT_QUEUE: "left_queue",
  READY: "ready",
  ON_KEY_DOWN: "on_key_down",
  ON_KEY_UP: "on_key_up",
  ON_KEY_UP: "on_key_up",
  ON_MOUSE_MOVE: "on_mouse_move",
  ON_MOUSE_DOWN: "on_mouse_down",
  ON_MOUSE_UP: "on_mouse_up",
  LEAVE_GAME: "leave_game",
  LEFT_GAME: "left_game",
  PLAYER_LEFT: "player_left",
  GAME_OVER: "game_over",
  UPDATE: "update",
  LOAD_LEVEL: "load_level",
  START_GAME_LOOP: "start_game_loop",
  STOP_GAME_LOOP: "stop_game_loop",

}




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
  window.SocketEvents = SocketEvents;
  window.PlayerConsts = PlayerConsts;
  window.MapConsts = MapConsts;
  window.WepIds = WepIds;
  window.WepProps = WepProps;
  window.BulletTypes = BulletTypes;
  window.BulletProps = BulletProps;
  window.BulletStateProps = BulletStateProps;
  window.ItemSpawnerDataProps = ItemSpawnerDataProps;
  window.ItemType = ItemType;
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
    MapStateProps,
    SocketEvents,
    PlayerConsts,
    MapConsts,
    WepIds,
    WepProps,
    BulletTypes,
    BulletProps,
    BulletStateProps,
    ItemSpawnerDataProps,
    ItemType
  };
}
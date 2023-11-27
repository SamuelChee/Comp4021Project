const Directions = Object.freeze({
  LEFT: 'left_dir',
  RIGHT: 'right_dir'
});

const Keys = Object.freeze({
  LEFT: 'left_key',
  RIGHT: 'right_key',
  JUMP: 'jump_key'
});

const Actions = Object.freeze({
  IDLE: 'idle_action',
  MOVE: 'move_action'
});

const PlayerStateProps = Object.freeze({
  X_INI: 'x_ini',
  Y_INI: 'y_ini',
  X: 'x',
  Y: 'y',
  X_VEL: 'xVel',
  ACTION: 'action',
  DIRECTION: 'direction',
  AIM_ANGLE: 'aimAngle',
  Y_VEL: 'yVel',
  TERMINAL_Y_VEL: 'terminalYVel',
  JUMP_VEL: 'jumpVel',
  GRAVITATIONAL_ACC: 'gravitationalAcceleration',
  IS_FALLING: 'isFalling',
  X_DIRECTION_MULTIPLE: 'xDirectionMultiple',
  WEP_ID: 'wepID'
});

if (typeof window !== 'undefined') {
  // Running in a browser
  window.Directions = Directions;
  window.Keys = Keys;
  window.Actions = Actions;
} else {
  // Running in Node.js
  module.exports = {
      Directions,
      Keys,
      Actions,
      PlayerStateProps  
  };
}
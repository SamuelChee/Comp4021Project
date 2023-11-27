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
      Actions  
  };
}
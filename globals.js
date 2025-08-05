import EventEmitter from 'eventemitter3';

const globals = {
  pixiScene: null,
  pixiApp: null,

  EventEmitter: new EventEmitter(),

  gameFinished: false,
};

export default globals;

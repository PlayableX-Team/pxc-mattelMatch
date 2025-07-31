import globals from '../../../globals';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import data from '../../config/data';
import * as THREE from 'three.quarks';

const TextureCache = PIXI.utils.TextureCache;
import AudioManager from '../../../engine/audio/AudioManager';

export default class Powerup {
  constructor(
    parent,
    asset,
    type,
    scale = 1,
    count = 1,
    posXPowerUp,
    posYPowerUp
  ) {
    this.count = count;
    this.asset = asset;
    this.scale = scale;
    this.parent = parent;
    this.posXPowerUp = posXPowerUp;
    this.posYPowerUp = posYPowerUp;
    this.type = type;
    this.init();
  }

  init() {
    console.log('Powerup constructor');

    const button = PIXI.Sprite.from(TextureCache[this.asset]);
    button.anchor.set(0.5);

    button.scale.set(this.scale);
    this.parent.addChild(button);
    button.position.set(this.posXPowerUp, this.posYPowerUp);
    button.interactive = true;
    button.buttonMode = true;

    button.on('pointerdown', () => {
      if (this.type === 'magnet') {
        console.log('Magnet powerup clicked');
      } else if (this.type === 'reverse') {
        console.log('Reverse powerup clicked');
      } else if (this.type === 'time') {
        console.log('Time powerup clicked');
      } else if (this.type === 'tornado') {
        globals.threeGame.tornado();
      }
    });
  }
}

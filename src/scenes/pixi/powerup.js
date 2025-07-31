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
    this.sprite = null;
    this.init();
  }

  init() {
    console.log('Powerup constructor');

    const button = PIXI.Sprite.from(TextureCache[this.asset]);
    this.sprite = button;
    button.anchor.set(0.5);

    button.scale.set(this.scale);
    this.parent.addChild(button);
    button.position.set(this.posXPowerUp, this.posYPowerUp);
    button.interactive = true;
    button.buttonMode = true;

    button.on('pointerdown', () => {
      button.interactive = false;
      gsap.to(button.scale, {
        x: button.scale.x * 0.9,
        y: button.scale.y * 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.delayedCall(0.3, () => {
            button.interactive = true;
          });
        },
      });
      if (this.type === 'magnet') {
        globals.threeGame.magnet();
      } else if (this.type === 'reverse') {
        globals.threeGame.reverse();
      } else if (this.type === 'time') {
        console.log('Time powerup clicked');
      } else if (this.type === 'tornado') {
        globals.threeGame.tornado();
      }
    });
  }
}

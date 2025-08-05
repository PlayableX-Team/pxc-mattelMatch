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
    count,
    posXPowerUp,
    posYPowerUp,
    grayAsset,
    grayScale
  ) {
    this.count = count;
    this.asset = asset;
    this.scale = scale;
    this.parent = parent;
    this.posXPowerUp = posXPowerUp;
    this.posYPowerUp = posYPowerUp;
    this.type = type;
    this.sprite = null;
    this.counterText = null;
    this.grayAsset = grayAsset;
    this.grayScale = grayScale;
    // Powerup konfigürasyonları
    this.powerupConfigs = {
      magnet: {
        canActivate: () => this.count > 0,
        action: () => globals.threeGame.magnet(),
      },
      reverse: {
        canActivate: () => this.count > 0 && globals.threeGame.tray.length > 0,
        action: () => {
          globals.threeGame.reverse();
          gsap.delayedCall(0.1, () => {
            this.checkReverseGrayAsset();
          });
        },
      },
      time: {
        canActivate: () => this.count > 0 && globals.pixiGame.isTimerRunning,
        action: () => {
          globals.pixiGame.pauseTimer();
          globals.pixiGame.timerBgAnimation();
          globals.pixiGame.addGlow();
          globals.pixiGame.timerPowerUpTextOpen();
          this.grayAsset.visible = true;
          this.button.visible = false;
          gsap.delayedCall(data.timerPowerUpEffect, () => {
            globals.pixiGame.resumeTimer();
            globals.pixiGame.stopTimerBgAnimation();
            globals.pixiGame.stopGlow();
            globals.pixiGame.timerPowerUpTextClose();
            this.checkGrayAsset();
          });
          console.log('Time powerup clicked');
        },
      },
      tornado: {
        canActivate: () => this.count > 0,
        action: () => {
          globals.threeGame.tornado();
          this.grayAsset.visible = true;
          this.button.visible = false;
          gsap.delayedCall(data.timerPowerUpEffect, () => {
            this.checkGrayAsset();
          });
        },
      },
    };

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
    this.button = button;

    const grayAsset = PIXI.Sprite.from(TextureCache[this.grayAsset]);
    this.parent.addChild(grayAsset);
    grayAsset.position.set(this.posXPowerUp, this.posYPowerUp);
    grayAsset.scale.set(this.grayScale);
    grayAsset.anchor.set(0.5);
    this.grayAsset = grayAsset;
    this.checkGrayAsset();

    // Tek bir event handler
    button.on('pointerdown', () => this.activatePowerup());

    // Counter UI oluşturma
    this.createCounterUI();
    this.checkReverseGrayAsset();
  }

  checkReverseGrayAsset() {
    if (this.type === 'reverse') {
      if (globals.threeGame.tray.length === 0) {
        this.grayAsset.visible = true;
        this.button.visible = false;
      } else if (globals.threeGame.tray.length > 0 && this.count > 0) {
        this.grayAsset.visible = false;
        this.button.visible = true;
      }
    }
  }

  checkGrayAsset() {
    if (this.count > 0) {
      this.grayAsset.visible = false;
      this.button.visible = true;
    } else {
      this.grayAsset.visible = true;
      this.button.visible = false;
    }
  }

  // Button animasyonu için ortak metod
  animateButton(button, onComplete) {
    button.interactive = false;
    gsap.to(button.scale, {
      x: button.scale.x * 0.9,
      y: button.scale.y * 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.delayedCall(0.1, () => {
          button.interactive = true;
          if (onComplete) onComplete();
        });
      },
    });
  }

  // Count güncelleme için ortak metod
  updateCount() {
    this.count--;
    this.count = Math.max(0, this.count); // 0'ın altına inmemesi için
    this.counterText.text = this.count;
    this.checkGrayAsset();
  }

  // Powerup aktivasyonu için ortak metod
  activatePowerup() {
    if (globals.gameFinished) return;
    const config = this.powerupConfigs[this.type];

    if (!config || !config.canActivate()) {
      return;
    }

    this.animateButton(this.sprite, () => {
      this.updateCount();
      config.action();
    });
  }

  // Counter UI oluşturma metodunu ayrı çıkarıyoruz
  createCounterUI() {
    const counterBg = PIXI.Sprite.from(TextureCache['counterBg']);
    this.parent.addChild(counterBg);
    counterBg.position.set(
      this.posXPowerUp + data.counterBgPosX,
      this.posYPowerUp + data.counterBgPosY
    );
    counterBg.scale.set(data.counterBgScale);
    counterBg.anchor.set(0.5);

    this.counterText = new PIXI.Text(this.count, {
      fontFamily: 'game-font',
      fontSize: 24,
      fill: 0x000000,
    });
    counterBg.addChild(this.counterText);
    this.counterText.anchor.set(0.5);
    this.counterText.position.set(0, 0);
  }
}

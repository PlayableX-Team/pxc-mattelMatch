import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { getDevicePlatform, openStorePage } from '../../../engine';
import globals from '../../../globals';
import Endcard from './Endcard';
// import { Spine } from "@pixi-spine/all-4.1";
import data from '../../config/data';
import AudioManager from '../../../engine/audio/AudioManager';
import Powerup from './powerup';

let pixiScene = null;
let pixiApp = null;

const TextureCache = PIXI.utils.TextureCache;

export default class PixiGame {
  constructor() {
    console.log('Game constructor');

    pixiScene = globals.pixiScene;
    pixiApp = globals.pixiApp;
    globals.pixiGame = this;
    this.magnetSprite = null;

    this.text = null;
  }

  start() {
    console.log('Game start pixi');

    // this.addBackground();
    // this.addHeaderText();

    globals.EventEmitter.on('gameFinished', () => {
      if (globals.gameFinished) return;
      new Endcard(true);
      globals.gameFinished = true;
      AudioManager.stopAllSFX();
    });
    this.addPowerUpPanel();
    this.addUpsidePanel();
  }

  addPowerUpPanel() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    const bg = PIXI.Sprite.from(TextureCache['powerupBg']);
    cont.iWidth = bg.width;
    cont.iHeight = bg.height;
    bg.anchor.set(0.5);

    cont.addChild(bg);
    this.powerUpPanel = cont;

    const FourPowerupPosConfig = [-150, -50, 50, 150];
    const ThreePowerupPosConfig = [-100, 0, 100];
    const TwoPowerupPosConfig = [-50, 50];
    const OnePowerupPosConfig = [0];

    // Aktif powerup'ları belirle
    const powerupConfigs = [
      {
        name: 'powerupMagnet',
        type: 'magnet',
        isOpen: data.isPowerUpMagnetOpen,
        scale: data.powerupMagnetScale,
      },
      {
        name: 'powerupReverse',
        type: 'reverse',
        isOpen: data.isPowerUpReverseOpen,
        scale: data.powerupReverseScale,
      },
      {
        name: 'powerupTornado',
        type: 'tornado',
        isOpen: data.isPowerUpTornadoOpen,
        scale: data.powerupTornadoScale,
      },
      {
        name: 'powerupTime',
        type: 'time',
        isOpen: data.isPowerUpTimeOpen,
        scale: data.powerupTimeScale,
      },
    ];

    // True olan powerup'ları filtrele
    const activePowerups = powerupConfigs.filter((config) => config.isOpen);
    const powerupCount = activePowerups.length;

    // Sayıya göre pozisyon config'ini seç
    let positionConfig;
    switch (powerupCount) {
      case 1:
        positionConfig = OnePowerupPosConfig;
        break;
      case 2:
        positionConfig = TwoPowerupPosConfig;
        break;
      case 3:
        positionConfig = ThreePowerupPosConfig;
        break;
      case 4:
        positionConfig = FourPowerupPosConfig;
        break;
      default:
        positionConfig = [];
    }

    // Aktif powerup'ları dinamik olarak oluştur
    activePowerups.forEach((powerupConfig, index) => {
      const powerup = new Powerup(
        cont,
        powerupConfig.name,
        powerupConfig.type,
        powerupConfig.scale,
        1,
        positionConfig[index] || 0,
        0
      );

      if (powerupConfig.type === 'magnet') {
        this.magnetSprite = powerup.sprite;
      }
    });

    cont.resize = (w, h) => {
      globals.threesc;
      cont.scale.set(
        Math.min((w * 0.8) / cont.iWidth, (h * 0.1) / cont.iHeight)
      );

      if (w < h) {
        cont.position.set(w * 0.5, h * 0.94);
      } else {
        cont.position.set(w * 0.5, h * 0.94);
      }
    };
    cont.resize(window.innerWidth, window.innerHeight);
  }

  addUpsidePanel() {
    const bg = PIXI.Sprite.from(TextureCache['headerBg']);
    pixiScene.addChild(bg);
    bg.anchor.set(0.5);
    bg.resize = (w, h) => {
      // Ekranın tam üstünde konumlandır
      bg.position.set(w * 0.5, bg.texture.height * bg.scale.y * 0.5);

      // X scale'ini ekran genişliği kadar yap
      bg.scale.x = w / bg.texture.width;

      // Y scale'ini ekran tipine göre adaptif yap
      const minScale =
        Math.min(w, h) / Math.max(bg.texture.width, bg.texture.height);
      const adaptiveScale = Math.min(
        minScale * 0.7,
        (h * 0.1) / bg.texture.height
      );
      bg.scale.y = adaptiveScale;

      // Pozisyonu scale'e göre yeniden ayarla
      bg.position.y = bg.texture.height * bg.scale.y * 0.5;
    };
    bg.resize(window.innerWidth, window.innerHeight);

    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    const timerBarBg = PIXI.Sprite.from(TextureCache['timer_bar_bg']);
    cont.iWidth = timerBarBg.width;
    cont.iHeight = timerBarBg.height;
    timerBarBg.anchor.set(0.5);

    cont.addChild(timerBarBg);

    const timerFillBar = PIXI.Sprite.from(TextureCache['timer_fill_bar']);
    cont.iWidth = timerFillBar.width;
    cont.iHeight = timerFillBar.height;
    timerFillBar.anchor.set(0.5);
    timerFillBar.position.set(0, timerBarBg.position.y);

    cont.resize = (w, h) => {
      cont.position.set(w * 0.5, bg.position.y);
      cont.scale.set(
        Math.min((w * 0.45) / cont.iWidth, (h * 0.05) / cont.iHeight)
      );
    };
    cont.addChild(timerFillBar);
    cont.resize(window.innerWidth, window.innerHeight);
  }

  addHeaderText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'game-font',
      fontSize: 85,
      fill: data.headerTextColor,
      strokeThickness: 0,
      wordWrap: false,
      align: 'center',
    });

    this.text = new PIXI.Text(data.headerText, style);
    pixiScene.addChild(this.text);

    this.text.iWidth = this.text.width;
    this.text.iHeight = this.text.height;
    this.text.anchor.set(0.5);

    this.text.resize = (w, h) => {
      this.text.x = w / 2;
      this.text.y = h * 0.3;
      this.text.scale.set(
        Math.min(w / this.text.iWidth, h / this.text.iHeight)
      );
    };
    this.text.resize(window.innerWidth, window.innerHeight);
  }

  addBackground() {
    let key = 'bg';
    let background;

    if (data.bgSrc) {
      background = PIXI.Sprite.from(TextureCache[key]);
    } else {
      background = new PIXI.Graphics();
      const drawBackground = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        background.clear();
        background.beginFill(data.flatBgColor);
        background.drawRect(0, 0, w, h);
        background.endFill();
      };

      drawBackground();
    }

    pixiScene.addChild(background);

    background.iWidth = background.width;
    background.iHeight = background.height;

    background.resize = (w, h) => {
      background.width = w;
      background.height = h;
    };
    background.resize(window.innerWidth, window.innerHeight);
  }

  addVideo() {
    // Create and position the video sprite
    const videoElement = globals.resources.video.data; // Directly get the video element from the resource
    videoElement.muted = true;
    if (getDevicePlatform() === 'ios') {
      videoElement.autoplay = true;
    }

    videoElement.setAttribute('playsinline', 'playsinline');

    const videoTexture = PIXI.Texture.from(videoElement);

    const videoSprite = new PIXI.Sprite(videoTexture);
    videoSprite.zIndex = 0;
    videoSprite.anchor.set(0.5);
    videoSprite.iWidth = videoElement.videoWidth;
    videoSprite.iHeight = videoElement.videoHeight;
    videoSprite.resize = (w, h) => {
      videoSprite.x = w / 2;
      videoSprite.y = h / 2;
      videoSprite.scale.set(
        Math.min(w / videoSprite.iWidth, h / videoSprite.iHeight)
      );
    };
    videoSprite.resize(window.innerWidth, window.innerHeight);

    pixiScene.addChild(videoSprite);
    gsap.delayedCall(1.45, () => {
      // console.log("pause video");
      videoElement.pause();
      this.showFaces();
    });

    this.video = videoSprite;
    this.video.controller = videoElement;
  }

  update(time, delta) {}
}

import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { getDevicePlatform, openStorePage } from '../../../engine';
import globals from '../../../globals';
import Endcard from './Endcard';
// import { Spine } from "@pixi-spine/all-4.1";
import data from '../../config/data';
import AudioManager from '../../../engine/audio/AudioManager';

let pixiScene = null;
let pixiApp = null;

const TextureCache = PIXI.utils.TextureCache;

export default class PixiGame {
  constructor() {
    console.log('Game constructor');

    pixiScene = globals.pixiScene;
    pixiApp = globals.pixiApp;

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

import * as PIXI from 'pixi.js';
import globals from '../../../globals';
import gsap from 'gsap';
import { openStorePage } from '../../../engine';
import data from '../../config/data';
const TextureCache = PIXI.utils.TextureCache;
let pixiScene;
export default class Endcard {
  constructor(didWon = false) {
    this.didWon = didWon;
    console.log('Endcard constructor');
    pixiScene = globals.pixiScene;
    this.init();
  }

  init() {
    console.log('Endcard start');
    // this.addBackground();
    this.drawBackground();
    this.addLogo();
    //this.addHeaderText();
    this.addButton();
    this.addMiddleImage();
  }

  addMiddleImage() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    const backRay = PIXI.Sprite.from(TextureCache['backRay']);
    backRay.anchor.set(0.5);
    cont.addChild(backRay);
    cont.iWidth = backRay.width;
    cont.iHeight = backRay.height;

    const middleImage = PIXI.Sprite.from(TextureCache['middleImage']);
    middleImage.anchor.set(0.5);
    cont.addChild(middleImage);
    cont.visible = data.isMiddleImageOpen;

    cont.resize = (w, h) => {
      if (w < h) {
        // Portrait mode
        cont.scale.set(
          Math.min((w * 0.8) / cont.iWidth, (h * 0.5) / cont.iHeight) *
            data.middleImageScaleVertical
        );
        cont.x = w * data.middleImagePosXVertical;
        cont.y = h * data.middleImagePosYVertical;
      } else {
        // Landscape mode
        cont.scale.set(
          Math.min((w * 0.5) / cont.iWidth, (h * 0.5) / cont.iHeight) *
            data.middleImageScaleHorizontal
        );
        cont.x = w * data.middleImagePosXHorizontal;
        cont.y = h * data.middleImagePosYHorizontal;
      }
    };
    cont.resize(window.innerWidth, window.innerHeight);
    gsap.fromTo(
      backRay,
      { pixi: { scale: 0 } },
      { pixi: { scale: 1 }, duration: 0.8, ease: 'back.out(1.3)' }
    );
    gsap.fromTo(
      middleImage,
      { pixi: { scale: 0 } },
      { pixi: { scale: 1 }, duration: 0.8, ease: 'back.out(1.3)' }
    );

    gsap.to(backRay, {
      rotation: backRay.rotation + Math.PI * 2,
      duration: 10,
      repeat: -1,
      ease: 'none',
    });
    backRay.visible = data.isMiddleImageBackRayOpen;
  }

  addButton() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);

    const button = PIXI.Sprite.from(TextureCache['endcardButton']);
    button.anchor.set(0.5);
    button.interactive = true;
    button.buttonMode = true;
    button.on('pointerdown', () => {
      openStorePage();
    });
    cont.visible = data.isEndcardButtonOpen;

    cont.addChild(button);
    cont.iWidth = button.width;
    cont.iHeight = button.height;

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.6) / cont.iWidth, (h * 0.15) / cont.iHeight) *
          data.endcardButtonScale
      );
      if (w < h) {
        cont.y = h * data.endcardButtonPosYVertical;
        cont.x = w * data.endcardButtonPosXVertical;
      } else {
        cont.y = h * data.endcardButtonPosYHorizontal;
        cont.x = w * data.endcardButtonPosXHorizontal;
      }
    };
    cont.resize(window.innerWidth, window.innerHeight);

    const text = new PIXI.Text('DOWNLOAD', {
      fontFamily: 'game-font',
      fontSize: 64,
      fill: 'white',
      align: 'center',
      stroke: 'black',
      strokeThickness: 6,
    });
    text.anchor.set(0.5);
    button.addChild(text);

    text.scale.set(
      Math.min(
        (cont.iWidth * 0.8) / text.width,
        (cont.iHeight * 0.8) / text.height
      )
    );

    //animate button
    gsap.fromTo(
      button,
      { pixi: { scale: 0 } },
      {
        pixi: { scale: 1 },
        duration: 0.6,
        ease: 'sine.out',
        onComplete: () => {
          gsap.to(button, {
            pixi: { scale: 1.1 },
            duration: 1,
            // ease: "power1.in",
            repeat: -1,
            yoyo: true,
          });
        },
      }
    );
  }

  addLogo() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);

    const logo = PIXI.Sprite.from(TextureCache['endcardLogo']);
    logo.anchor.set(0.5);

    cont.width = cont.iWidth = logo.width;
    cont.width = cont.iHeight = logo.height;
    cont.addChild(logo);
    cont.visible = data.isEndcardLogoOpen;

    cont.resize = (w, h) => {
      if (w < h) {
        cont.y = h * data.endcardLogoPosYVertical;
        cont.x = w * data.endcardLogoPosXVertical;
        cont.scale.set(
          Math.min((w * 0.9) / cont.iWidth, (h * 0.3) / cont.iHeight) *
            data.endcardLogoScaleVertical
        );
      } else {
        cont.y = h * data.endcardLogoPosYHorizontal;
        cont.x = w * data.endcardLogoPosXHorizontal;
        cont.scale.set(
          Math.min((w * 0.9) / cont.iWidth, (h * 0.3) / cont.iHeight) *
            data.endcardLogoScaleHorizontal
        );
      }
    };
    cont.resize(window.innerWidth, window.innerHeight);

    //animate logo
    gsap.fromTo(
      logo,
      { pixi: { scale: 0 } },
      { pixi: { scale: 1 }, duration: 0.8, ease: 'back.out(1.3)' }
    );
  }

  addBackground() {
    const background = PIXI.Sprite.from(TextureCache['bg']);
    background.anchor.set(0.5);
    background.iWidth = background.width;
    background.iHeight = background.height;

    background.resize = (w, h) => {
      background.scale.set(
        Math.max(w / background.iWidth, h / background.iHeight)
      );
      background.position.set(w / 2, h / 2);
    };
    background.resize(window.innerWidth, window.innerHeight);

    pixiScene.addChild(background);

    //animate background
    gsap.fromTo(
      background,
      { pixi: { alpha: 0 } },
      { pixi: { alpha: 1 }, duration: 0.4 }
    );
  }

  drawBackground() {
    const bg = new PIXI.Graphics();
    bg.beginFill(data.endcardBackgroundColor);
    bg.drawRect(0, 0, window.innerWidth, window.innerHeight);
    bg.endFill();
    bg.alpha = data.endcardBackgroundAlpha;
    pixiScene.addChild(bg);
    bg.resize = (w, h) => {
      bg.width = w;
      bg.height = h;
    };
    bg.resize(window.innerWidth, window.innerHeight);
    bg.interactive = true;
    bg.buttonMode = true;
    bg.on('pointerdown', () => {
      openStorePage();
    });
    gsap.fromTo(
      bg,
      { pixi: { alpha: 0 } },
      { pixi: { alpha: data.endcardBackgroundAlpha }, duration: 0.4 }
    );
  }

  addHeaderText() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    cont.visible = data.isEndcardHeaderTextOpen;
    cont.width = cont.iWidth = 100;
    cont.height = cont.iHeight = 100;
    const text = new PIXI.Text(data.endcardHeaderText, {
      fontFamily: 'game-font',
      fontSize: 50,
      fill: data.endcardHeaderTextFontColor,
      align: 'center',
      stroke: data.endcardHeaderTextFontStroke,
      strokeThickness: data.endcardHeaderTextFontStrokeThickness,
      lineJoin: 'round',
    });
    text.anchor.set(0.5);
    cont.addChild(text);
    text.text = data.endcardHeaderText.split('_').join('\n');

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w / cont.iWidth) * 0.8, (h / cont.iHeight) * 0.2) *
          data.endcardHeaderTextScale
      );
      if (w < h) {
        cont.y = h * data.endcardHeaderTextPosYVertical;
        cont.x = w * data.endcardHeaderTextPosXVertical;
      } else {
        cont.y = h * data.endcardHeaderTextPosYHorizontal;
        cont.x = w * data.endcardHeaderTextPosXHorizontal;
      }
    };
    cont.resize(window.innerWidth, window.innerHeight);

    //animate header text
    gsap.fromTo(
      text,
      { pixi: { scale: 0 } },
      { pixi: { scale: 1 }, duration: 0.8, ease: 'back.out(1.3)' }
    );
  }
}

import * as PIXI from "pixi.js";
import globals from "../../../globals";
import gsap from "gsap";
import { openStorePage } from "../../../engine";
const TextureCache = PIXI.utils.TextureCache;
let pixiScene;
export default class Endcard {
  constructor(didWon = false) {
    this.didWon = didWon;
    console.log("Endcard constructor");
    pixiScene = globals.pixiScene;
    this.init();
  }

  init() {
    console.log("Endcard start");
    this.addBackground();
    this.addLogo();
    this.addButton();
  }

  addButton() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);

    const button = PIXI.Sprite.from(TextureCache["button"]);
    button.anchor.set(0.5);
    button.interactive = true;
    button.buttonMode = true;
    button.on("pointerdown", () => {
      openStorePage();
    });

    cont.addChild(button);
    cont.iWidth = button.width;
    cont.iHeight = button.height;

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.6) / cont.iWidth, (h * 0.15) / cont.iHeight)
      );
      cont.y = h * 0.85;
      cont.x = w / 2;
    };
    cont.resize(window.innerWidth, window.innerHeight);

    const text = new PIXI.Text("DOWNLOAD", {
      fontFamily: "game-font",
      fontSize: 64,
      fill: "white",
      align: "center",
      stroke: "black",
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
        ease: "sine.out",
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

    const logo = PIXI.Sprite.from(TextureCache["logo"]);
    logo.anchor.set(0.5);

    cont.width = cont.iWidth = logo.width;
    cont.width = cont.iHeight = logo.height;
    cont.addChild(logo);

    cont.resize = (w, h) => {
      cont.scale.set(
        Math.min((w * 0.9) / cont.iWidth, (h * 0.3) / cont.iHeight)
      );
      cont.y = h * 0.2;
      cont.x = w / 2;
    };
    cont.resize(window.innerWidth, window.innerHeight);

    //animate logo
    gsap.fromTo(
      logo,
      { pixi: { scale: 0 } },
      { pixi: { scale: 1 }, duration: 0.8, ease: "back.out(1.3)" }
    );
  }

  addBackground() {
    const background = PIXI.Sprite.from(TextureCache["bg"]);
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
}

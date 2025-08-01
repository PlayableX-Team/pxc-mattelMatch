import globals from '../../../globals';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import data from '../../config/data';
import * as THREE from 'three.quarks';

const TextureCache = PIXI.utils.TextureCache;
import AudioManager from '../../../engine/audio/AudioManager';

export default class RemainingObj {
  constructor(parent, bgAsset, bgScale, bgPosX, bgPosY, count) {
    this.parent = parent;
    this.bgAsset = bgAsset;
    this.bgScale = bgScale;
    this.bgPosX = bgPosX;
    this.bgPosY = bgPosY;
    this.count = count;
    this.init();
  }

  init() {
    const bg = PIXI.Sprite.from(TextureCache[this.bgAsset]);
    this.bgSprite = bg;
    bg.anchor.set(0.5);
    bg.scale.set(this.bgScale);
    this.parent.addChild(bg);
    bg.position.set(this.bgPosX, this.bgPosY);

    this.countText = new PIXI.Text(this.count, {
      fontFamily: 'game-font',
      fontSize: 36,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 5,
    });
    this.countText.anchor.set(0.5, -0.3);
    this.bgSprite.addChild(this.countText);
  }

  updateCount(changeAmount) {
    // changeAmount pozitif ise arttır, negatif ise azalt
    const oldCount = this.count;
    this.count += changeAmount;

    // Count 0'ın altına düşmesin
    this.count = Math.max(0, this.count);

    if (this.countText) {
      this.countText.text = this.count;

      // Visual feedback - count değiştiğinde küçük animasyon
      gsap.killTweensOf(this.countText.scale);
      gsap.to(this.bgSprite.scale, {
        x: this.bgSprite.scale.x * 1.1,
        y: this.bgSprite.scale.y * 1.1,
        duration: 0.1,
        ease: 'power1.out',
        yoyo: true,
        repeat: 1,
      });
    } else {
    }
  }
}

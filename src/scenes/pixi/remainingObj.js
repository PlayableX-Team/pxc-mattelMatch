import globals from '../../../globals';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import data from '../../config/data';
import * as THREE from 'three.quarks';

const TextureCache = PIXI.utils.TextureCache;
import AudioManager from '../../../engine/audio/AudioManager';

export default class RemainingObj {
  constructor(
    parent,
    bgAsset,
    bgScale,
    bgPosX,
    bgPosY,
    objAsset,
    objCount,
    objScale,
    objPosX,
    objPosY
  ) {
    this.parent = parent;
    this.bgAsset = bgAsset;
    this.bgScale = bgScale;
    this.bgPosX = bgPosX;
    this.bgPosY = bgPosY;
    this.objAsset = objAsset;
    this.objCount = objCount;
    this.objScale = objScale;
    this.objPosX = objPosX;
    this.objPosY = objPosY;
    this.bgSprite = null;
    this.objSprite = null;
    this.objCountText = null;
    this.init();
  }

  init() {}
}

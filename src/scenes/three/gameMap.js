import * as THREE from 'three';
import globals from '../../../globals';
import gsap from 'gsap';
import AudioManager from '../../../engine/audio/AudioManager';
import data from '../../config/data';
import * as CANNON from 'cannon-es';

export default class GameMap extends THREE.Object3D {
  constructor(slotPositions = [], slotAvailable = [], slotObjects = []) {
    super();
    this.slotPositions = slotPositions;
    this.slotAvailable = slotAvailable;
    this.slotObjects = slotObjects;
  }

  update(ratio, delta) {}
}

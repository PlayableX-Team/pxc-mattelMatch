import gsap from 'gsap';
import * as THREE from 'three';
import SphericalCamera from './scripts/sphericalCamera';
import globals from '../../../globals';
import { PhysicsManager } from '../../../engine/physics/PhysicsManager';
import { randFloat, randInt } from 'three/src/math/MathUtils.js';
import AudioManager from '../../../engine/audio/AudioManager';
import data from '../../config/data';
import MapObject from './mapObjects';
import TouchTransformer from '../../../engine/utils/TouchTransformer';
import GameMap from './gameMap';

export default class ThreeGame {
  constructor() {
    console.log('ThreeGame constructor');
    this.scene = globals.threeScene;
    this.renderManager = globals.renderManager;
    this.models = this.renderManager.threeRenderer.models;
    this.slotPositions = [];
    this.slotAvailable = [true, true, true, true, true, true, true];
    this.gameMap = new GameMap(this.slotPositions, this.slotAvailable);

    console.log(this.gameMap);

    // Setup orbit controls if needed
    // this.controls = new OrbitControls(this.renderManager.threeRenderer.camera, this.renderManager.threeRenderer.view);

    // Store animations and mixers
    this.animations = {};
    globals.threeUpdateList = [];
  }

  start() {
    console.log('ThreeGame start');
    this.physicsManager = new PhysicsManager(true);
    globals.physicsManager = this.physicsManager;

    let test_cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    test_cube.position.set(0, 0, 0);
    //  globals.threeScene.add(test_cube);

    // Add a spherical camera
    new SphericalCamera(test_cube);

    // Create array to store 30 MapObjects
    this.mapObjects = [];

    // Create 30 objects with random positions within ground collider area
    for (let i = 0; i < 10; i++) {
      // Random positions within ground area (with padding to avoid walls)
      // Ground is 10x10, so we use -4 to +4 range for safety buffer
      const randomX = randFloat(-4, 4);
      const randomZ = randFloat(-4, 4);
      const yPosition = 5; // Keep same height as original

      const mapObject = new MapObject(
        'tyre-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        1
      );
      this.mapObjects.push(mapObject);
      console.log(mapObject.objectType);

      const mapObject2 = new MapObject(
        'tv-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        2
      );
      this.mapObjects.push(mapObject2);

      const mapObject3 = new MapObject(
        'junk_07-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        3
      );
      this.mapObjects.push(mapObject3);
    }

    this.addGroundCollider();
    this.createClickListener();
    this.addCollectArea();
  }

  addGroundCollider() {
    // Create the ground
    let ground = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    ground.material.opacity = 0;
    ground.material.transparent = true;
    ground.position.set(0, 0, 0);
    ground.rotateX(-Math.PI / 2);
    ground.scale.setScalar(1);
    globals.threeScene.add(ground);

    ground.body = this.physicsManager.createBodyFromObject(ground, {
      type: 'static',
      mass: 0,
    });

    // Add walls around the ground perimeter
    const wallHeight = 10;
    const wallThickness = 0.2;
    const groundSize = 15; // Changed from 10 to 15 to match ground dimensions

    // North wall (positive Z)
    let northWall = new THREE.Mesh(
      new THREE.BoxGeometry(groundSize, wallHeight, wallThickness),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    northWall.position.set(0, wallHeight / 2, groundSize / 2);
    globals.threeScene.add(northWall);
    northWall.body = this.physicsManager.createBodyFromObject(northWall, {
      type: 'static',
      mass: 0,
    });

    // South wall (negative Z)
    let southWall = new THREE.Mesh(
      new THREE.BoxGeometry(groundSize, wallHeight, wallThickness),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    southWall.position.set(0, wallHeight / 2, -groundSize / 2);
    globals.threeScene.add(southWall);
    southWall.body = this.physicsManager.createBodyFromObject(southWall, {
      type: 'static',
      mass: 0,
    });

    // East wall (positive X)
    let eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, groundSize),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    eastWall.position.set(groundSize / 2, wallHeight / 2, 0);
    globals.threeScene.add(eastWall);
    eastWall.body = this.physicsManager.createBodyFromObject(eastWall, {
      type: 'static',
      mass: 0,
    });

    // West wall (negative X)
    let westWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, groundSize),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    westWall.position.set(-groundSize / 2, wallHeight / 2, 0);
    globals.threeScene.add(westWall);
    westWall.body = this.physicsManager.createBodyFromObject(westWall, {
      type: 'static',
      mass: 0,
    });
  }

  createClickListener() {
    // Initialize TouchTransformer with the camera
    this.touchTransformer = new TouchTransformer(globals.threeCamera);

    // Add pointer down event listener
    document.addEventListener('pointerdown', (event) => {
      // Get all the models from mapObjects for raycasting
      let allMapObjectModels = this.mapObjects.map((mapObj) => mapObj.model);

      // Get intersections with map object models
      let intersects = this.touchTransformer.getIntersects(
        event.clientX,
        event.clientY,
        allMapObjectModels
      );

      if (intersects.length > 0) {
        // Find which mapObject was clicked by matching the model
        let clickedModel = intersects[0].object;
        let clickedMapObject = this.mapObjects.find((mapObj) => {
          // Check if the clicked object is the model or a child of the model
          return (
            mapObj.model === clickedModel ||
            mapObj.model.children.includes(clickedModel)
          );
        });

        if (clickedMapObject) {
          console.log('Map object clicked!', clickedMapObject.objectType);

          // Make the clicked map object invisible
          clickedMapObject.visible = false;

          // disable the physics body to prevent invisible collisions
          if (clickedMapObject.body) {
            globals.physicsManager.world.removeBody(clickedMapObject.body);
            clickedMapObject.body = null;
          }
        }
      }
    });
  }

  addCollectArea() {
    // 7 tane yan yana dizilmiş plane ekle
    for (let i = 0; i < 7; i++) {
      let plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          color: 0x00ff00,
          side: THREE.DoubleSide,
        })
      );

      // Plane'leri yan yana diz (x ekseninde)
      plane.position.set(i * 1.8 - 5.4, 0, 15); // Ortalanmış pozisyon (scale 1.5 için aralık ayarlandı)
      plane.rotation.x = -Math.PI / 2; // Yatay plane için rotasyon
      plane.scale.set(1.5, 1.5, 1.5); // Scale 1.5x1.5 yap

      this.slotPositions.push(plane.position);

      this.scene.add(plane);
    }
  }

  update(time, delta) {
    // Update animations
    globals.threeUpdateList.forEach((obj) => obj.update(time, delta));

    this.physicsManager.update(delta);

    // Update all map objects
    this.mapObjects.forEach((mapObject) => {
      mapObject.update(time, delta);
    });

    // Update any other game logic here
  }
}

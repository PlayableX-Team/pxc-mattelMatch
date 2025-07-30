import gsap from 'gsap';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
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
    this.slotObjects = [];
    this.slotPlanes = []; // Plane referansları için

    // Enhanced tray system
    this.tray = [];
    this.onTray = [];
    this.platforms = [];
    this.trayObj = null;
    this.tweening = false;
    this.itemsCollected = 0;

    this.gameMap = new GameMap(
      this.slotPositions,
      this.slotAvailable,
      this.slotObjects
    );

    // Setup orbit controls if needed
    // this.controls = new OrbitControls(this.renderManager.threeRenderer.camera, this.renderManager.threeRenderer.view);

    // Store animations and mixers
    this.animations = {};
    globals.threeUpdateList = [];

    document.addEventListener('keydown', (event) => {
      // console.log(event);
      if (event.key == 'e') {
        console.log('e');
        this.tornado();
      }
    });
  }

  start() {
    console.log('ThreeGame start');
    this.physicsManager = new PhysicsManager(false);
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
    this.objOffset = 7;

    let yPosition = 10;
    // Create 30 objects with random positions within ground collider area
    for (let i = 0; i < 10; i++) {
      // Random positions within ground area (with padding to avoid walls)
      // Ground is 10x10, so we use -4 to +4 range for safety buffer
      const randomX = randFloat(-this.objOffset, this.objOffset);
      const randomZ = randFloat(-this.objOffset, this.objOffset);

      const mapObject = new MapObject(
        'tyre-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        1
      );
      this.mapObjects.push(mapObject);
      console.log(mapObject.objectType);
    }

    for (let i = 0; i < 10; i++) {
      const randomX = randFloat(-this.objOffset, this.objOffset);
      const randomZ = randFloat(-this.objOffset, this.objOffset);

      const mapObject = new MapObject(
        'tv-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        2
      );
      this.mapObjects.push(mapObject);
    }

    for (let i = 0; i < 10; i++) {
      const randomX = randFloat(-this.objOffset, this.objOffset);
      const randomZ = randFloat(-this.objOffset, this.objOffset);

      const mapObject = new MapObject(
        'junk_07-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        3
      );
      this.mapObjects.push(mapObject);
    }

    for (let i = 0; i < 10; i++) {
      const randomX = randFloat(-this.objOffset, this.objOffset);
      const randomZ = randFloat(-this.objOffset, this.objOffset);

      const mapObject = new MapObject(
        'junk_02-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        4
      );
      this.mapObjects.push(mapObject);
    }

    for (let i = 0; i < 10; i++) {
      const randomX = randFloat(-this.objOffset, this.objOffset);
      const randomZ = randFloat(-this.objOffset, this.objOffset);

      const mapObject = new MapObject(
        'junk_04-v1',
        1,
        new THREE.Vector3(randomX, yPosition, randomZ),
        5
      );
      this.mapObjects.push(mapObject);
    }

    this.addGroundCollider();
    this.createClickListener();
    this.addEnhancedTray(7); // Create enhanced tray with 7 slots
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

          // Check if tray is full or tweening in progress
          if (this.tweening || this.tray.length >= 7) {
            console.log('Cannot collect: tray full or animation in progress');
            return;
          }

          // Enhanced collection with sophisticated animations
          this.gather(clickedMapObject);
        }
      }
    });
  }

  // Enhanced collection system with sophisticated animations
  gather(obj) {
    this.itemsCollected++;

    // Play collection sound effect
    if (AudioManager) {
      AudioManager.playSFX('collect'); // Add collect sound to your audio assets
    }

    const platformCount = 7;
    const diff = Math.abs(platformCount - 5);
    const scl = 0.6 - diff * 0.1;

    // Remove physics body
    if (obj.body) {
      globals.physicsManager.world.removeBody(obj.body);
      obj.body = null;
    }

    // Remove from mapObjects array
    const objectIndex = this.mapObjects.indexOf(obj);
    if (objectIndex > -1) {
      this.mapObjects.splice(objectIndex, 1);
    }

    // Add to tray system
    this.trayObj.attach(obj);
    this.insertToTray(obj);

    // Kill existing animations
    gsap.killTweensOf(obj.rotation);
    gsap.killTweensOf(obj.scale);
    gsap.killTweensOf(obj.position);

    // Rotation animation - align with platform
    gsap.to(obj.rotation, {
      x: -Math.PI / 2,
      y: 0,
      z: 0,
      duration: 0.3,
      ease: 'sine.inOut',
    });

    // Scale animation - 3-stage: grow, shrink, bounce
    gsap.to(obj.scale, {
      x: '+=0.3',
      y: '+=0.3',
      z: '+=0.3',
      duration: 0.25,
      ease: 'sine.inOut',
      onComplete: () => {
        gsap.to(obj.scale, {
          x: scl,
          y: scl,
          z: scl,
          duration: 0.25,
          onComplete: () => {
            // Platform landing sound
            if (AudioManager) {
              AudioManager.playSFX('platform');
            }

            // Bounce effect
            gsap.to(obj.scale, {
              x: scl * 1.2,
              y: scl * 1.2,
              z: scl * 1.2,
              duration: 0.15,
              delay: 0.1,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: 1,
            });
          },
        });
      },
    });

    // Mark as tapped for animation system
    obj.isTapped = true;

    // Sort and assign positions
    this.sortAssign();
  }

  // Enhanced tray system with sophisticated platform management
  addEnhancedTray(count) {
    const diff = Math.abs(count - 5);
    let scalar = 1;

    const scl = scalar - diff * 0.01;
    const offset = 1.2 - diff * 0.01;
    let tray = new THREE.Object3D();
    this.trayObj = tray;

    // Create platforms with enhanced materials and animations
    for (let i = 0; i < count; i++) {
      // Create platform geometry
      let platform = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({
          color: 0x4caf50,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        })
      );

      // Position and scale platforms
      platform.position.set(i * offset, 0, 0);
      platform.scale.set(scl, scl, scl);
      platform.rotation.x = Math.PI / 4;
      platform.oScale = scl;
      platform.oPos = platform.position.clone();

      // Add visual enhancements
      platform.receiveShadow = true;

      tray.add(platform);
      this.platforms.push(platform);

      // Store in legacy arrays for compatibility
      let worldPosition = new THREE.Vector3();
      platform.getWorldPosition(worldPosition);
      this.slotPositions.push(worldPosition);
      this.slotPlanes.push(platform);
    }

    tray.updateMatrixWorld(true);
    this.scene.add(tray);

    // Position the entire tray
    tray.position.x = ((-offset * (count - 1)) / 2) * 1.4;
    tray.position.z = 12;
    tray.scale.setScalar(1.4);
    //tray.rotation.x = -Math.PI / 2;

    console.log('Enhanced tray system initialized with', count, 'platforms');
  }

  // Smart item insertion for organized placement
  insertToTray(obj) {
    let lastIndex = this.tray.findLast(
      (item) => item.objectType === obj.objectType
    );
    let filtered = this.tray.filter(
      (item) => item.objectType === obj.objectType
    );

    if (filtered.length >= 3) {
      this.tray.push(obj);
      return;
    }

    if (lastIndex) {
      this.tray.splice(this.tray.indexOf(lastIndex) + 1, 0, obj);
    } else {
      this.tray.push(obj);
    }
  }

  // Sophisticated assignment and animation system
  sortAssign() {
    this.tray.forEach((item, index) => {
      if (item.platform === this.platforms[index]) return;

      item.platform = this.platforms[index];

      if (!item.platform) {
        console.log('No more platforms available!');
        return;
      }

      let dest = item.platform.oPos.clone();
      dest.y += 0.3;
      dest.z -= 0.32;
      item.dest = dest;

      gsap.killTweensOf(item.position);

      if (item.isTapped) {
        // Multi-stage sophisticated movement animation

        // Z-axis movement with platform interaction
        gsap.to(item.position, {
          z: dest.z,
          duration: 0.4,
          ease: 'power1.in',
          onStart: () => {
            console.log('Starting sophisticated movement for', item.objectType);
          },
          onComplete: () => {
            // First bounce forward
            gsap.to(item.position, {
              z: '+=0.2',
              duration: 0.1,
              ease: 'sine.out',
            });

            // Platform bounce animation
            gsap.killTweensOf(item.platform.position);
            item.platform.position.copy(item.platform.oPos);
            gsap.to(item.platform.position, {
              z: '+=0.2',
              duration: 0.1,
              ease: 'sine.out',
              yoyo: true,
              repeat: 1,
            });

            // Complex multi-stage bounce sequence
            gsap.to(item.position, {
              z: '-=0.8',
              duration: 0.15,
              ease: 'sine.inOut',
              delay: 0.1,
              onComplete: () => {
                // Final settling animation
                gsap.to(item.position, {
                  z: '+=0.6',
                  duration: 0.2,
                  ease: 'sine.inOut',
                  onComplete: () => {
                    item.isTapped = false;
                    if (this.onTray.includes(item)) return;

                    this.onTray.push(item);
                    this.checkMatches();

                    // Disable shadows for performance
                    item.traverse((child) => {
                      child.castShadow = false;
                    });
                  },
                });
              },
            });
          },
        });

        // X-axis movement - smooth horizontal slide
        gsap.to(item.position, {
          x: dest.x,
          duration: 0.4,
          ease: 'sine.inOut',
        });

        // Y-axis movement - parabolic arc
        gsap.to(item.position, {
          y: dest.y + 3,
          duration: 0.2,
          ease: 'sine.in',
          onComplete: () => {
            gsap.to(item.position, {
              y: dest.y,
              duration: 0.2,
              ease: 'sine.out',
            });
          },
        });
      } else {
        // Smooth repositioning for non-tapped items
        gsap.killTweensOf(item.position);
        gsap.to(item.position, {
          x: dest.x,
          y: dest.y,
          ease: 'sine.inOut',
          duration: 0.2,
          delay: 0.2,
        });
        gsap.to(item.position, {
          z: dest.z - 0.2,
          duration: 0.1,
          ease: 'sine.inOut',
          delay: 0.2,
          onComplete: () => {
            gsap.to(item.position, {
              z: dest.z,
              duration: 0.1,
              ease: 'sine.inOut',
            });
          },
        });
      }
    });
  }

  // Check for matches and handle match animations
  checkMatches() {
    console.log('Checking for matches...');

    const groupedItems = this.onTray.reduce((acc, item) => {
      if (!acc[item.objectType]) {
        acc[item.objectType] = [];
      }
      acc[item.objectType].push(item);
      return acc;
    }, {});

    let isMatch = false;

    for (const key in groupedItems) {
      if (groupedItems[key].length >= 3) {
        isMatch = true;
        this.tweening = true;

        console.log('Match found for', key, '- processing match animation...');

        // Play match sound
        if (AudioManager) {
          AudioManager.playSFX('match');
        }

        // Sophisticated match animation
        for (let i = 0; i < 3; i++) {
          const element = groupedItems[key][i];

          this.onTray.splice(this.onTray.indexOf(element), 1);
          this.tray.splice(this.tray.indexOf(element), 1);

          gsap.killTweensOf(element.position);
          gsap.killTweensOf(element.scale);

          const dest = groupedItems[key][1].platform.position.clone();

          if (i === 1) {
            // Center item - scale and disappear animation
            gsap.to(element.scale, {
              x: element.scale.x * 1.3,
              y: element.scale.y * 1.3,
              z: element.scale.z * 1.3,
              duration: 0.2,
              delay: 0.15,
              ease: 'sine.out',
              onComplete: () => {
                gsap.to(element.scale, {
                  x: 0,
                  y: 0,
                  z: 0,
                  duration: 0.25,
                  ease: 'back.in(3)',
                  onComplete: () => {
                    element.visible = false;
                  },
                });
              },
            });

            // Platform bounce for center item
            gsap.killTweensOf(element.platform.position);
            element.platform.position.copy(element.platform.oPos);
            gsap.to(element.platform.position, {
              z: '+=0.3',
              duration: 0.15,
              ease: 'sine.out',
              yoyo: true,
              repeat: 1,
            });
          } else {
            // Side items - converge to center
            gsap.to(element.position, {
              x: dest.x,
              delay: 0.15,
              ease: 'back.in(3)',
              duration: 0.35,
              onStart: () => {
                this.matchOnProgress = false;
              },
              onComplete: () => {
                element.visible = false;
                if (i === 2) {
                  this.tweening = false;
                  console.log(
                    'Match animation completed - reorganizing tray...'
                  );
                  this.sortAssign();
                }
              },
            });

            gsap.to(element.position, {
              z: dest.z - 0.7,
              duration: 0.3,
              ease: 'back.in(3)',
            });

            // Platform bounce animation
            gsap.killTweensOf(element.platform.position);
            element.platform.position.copy(element.platform.oPos);
            gsap.to(element.platform.position, {
              z: '+=0.2',
              duration: 0.15,
              ease: 'sine.out',
              yoyo: true,
              repeat: 1,
            });
          }
        }
      }
    }

    if (!isMatch && this.tray.length === this.platforms.length) {
      console.log('Tray full - no matches possible');
      // Handle game over state here
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
  }
}

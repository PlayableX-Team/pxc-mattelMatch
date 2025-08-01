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
    globals.threeGame = this;
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

  // Helper function to check if position is safe (no overlap)
  isSafePosition(x, z, minDistance = 2) {
    return !this.usedPositions.some((pos) => {
      const distance = Math.sqrt(
        Math.pow(pos.x - x, 2) + Math.pow(pos.z - z, 2)
      );
      return distance < minDistance;
    });
  }

  // Helper function to get safe random position
  getSafePosition(minDistance = 2, maxAttempts = 50) {
    let attempts = 0;
    let randomX, randomZ;

    do {
      randomX = randFloat(-this.objOffset, this.objOffset);
      randomZ = randFloat(-this.objOffset, this.objOffset);
      attempts++;
    } while (
      !this.isSafePosition(randomX, randomZ, minDistance) &&
      attempts < maxAttempts
    );

    // Store the used position
    this.usedPositions.push({ x: randomX, z: randomZ });
    return { x: randomX, z: randomZ };
  }

  start() {
    console.log('ThreeGame start');
    this.physicsManager = new PhysicsManager(false);
    globals.physicsManager = this.physicsManager;

    // Ground parametrelerini tanımla (tüm sistemde kullanılacak)
    this.groundHalfX = 7;
    this.groundHalfZ = 8;
    this.groundHeight = 0.1;

    let test_cube = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    test_cube.position.set(0, 0, 2); // Ground merkez z=2'ye göre
    //  globals.threeScene.add(test_cube);

    // Add a spherical camera
    new SphericalCamera(test_cube);

    // Create array to store 30 MapObjects
    this.mapObjects = [];
    // objOffset'i ground size'a göre dinamik hesapla (güvenli buffer için biraz küçük tut)
    this.objOffset = Math.min(this.groundHalfX - 0.5, this.groundHalfZ - 0.5);
    this.usedPositions = []; // Track used positions to prevent overlap

    let yPosition = 10;
    // Create objects with safe positions to prevent overlap
    for (let i = 0; i < data.barbieBoatCount; i++) {
      const safePos = this.getSafePosition(1.5); // 1.5 unit minimum distance

      const mapObject = new MapObject(
        'barbieBoat',
        data.barbieBoatScale,
        new THREE.Vector3(safePos.x, 10, safePos.z + 2), // Ground merkez z=2'ye göre
        1
      );
      this.mapObjects.push(mapObject);
      console.log(mapObject.objectType);
    }

    for (let i = 0; i < data.barbieCarCount; i++) {
      const safePos = this.getSafePosition(1.5);

      const mapObject = new MapObject(
        'barbieCar',
        data.barbieCarScale,
        new THREE.Vector3(safePos.x, 10, safePos.z + 2), // Ground merkez z=2'ye göre
        2
      );
      this.mapObjects.push(mapObject);
    }

    for (let i = 0; i < data.barbieGirl1Count; i++) {
      const safePos = this.getSafePosition(1.5);

      const mapObject = new MapObject(
        'barbieGirl1',
        data.barbieGirl1Scale,
        new THREE.Vector3(safePos.x, 10, safePos.z + 2), // Ground merkez z=2'ye göre
        3
      );
      this.mapObjects.push(mapObject);
    }

    for (let i = 0; i < data.barbieGirl2Count; i++) {
      const safePos = this.getSafePosition(1.5);

      const mapObject = new MapObject(
        'barbieGirl2',
        data.barbieGirl2Scale,
        new THREE.Vector3(safePos.x, 10, safePos.z + 2), // Ground merkez z=2'ye göre
        4
      );
      this.mapObjects.push(mapObject);
    }

    for (let i = 0; i < data.barbieHouseCount; i++) {
      const safePos = this.getSafePosition(2.0); // Larger objects need more space

      const mapObject = new MapObject(
        'barbieHouse',
        data.barbieHouseScale,
        new THREE.Vector3(safePos.x, 10, safePos.z + 2), // Ground merkez z=2'ye göre
        5
      );
      this.mapObjects.push(mapObject);
    }

    for (let i = 0; i < data.barbieKenCount; i++) {
      const safePos = this.getSafePosition(1.5);

      const mapObject = new MapObject(
        'barbieKen',
        data.barbieKenScale,
        new THREE.Vector3(safePos.x, 10, safePos.z + 2), // Ground merkez z=2'ye göre
        6
      );
      this.mapObjects.push(mapObject);
    }

    this.addGroundCollider();
    this.createClickListener();
    this.addEnhancedTray(7); // Create enhanced tray with 7 slots
  }

  addGroundCollider() {
    // Class değişkenlerinden ground boyutlarını kullan
    const groundSizeX = this.groundHalfX * 2;
    const groundSizeZ = this.groundHalfZ * 2;

    // Create a very flat box as ground
    const groundShape = new CANNON.Box(
      new CANNON.Vec3(this.groundHalfX, this.groundHeight, this.groundHalfZ)
    );
    const groundBody = new CANNON.Body({
      mass: 0,
      type: CANNON.Body.STATIC,
    });

    groundBody.addShape(groundShape);
    groundBody.position.set(0, -this.groundHeight, 2); // Biraz aşağıda konumlandır

    // Add body to physics world
    this.physicsManager.world.addBody(groundBody);

    // Optional: Create visual ground for debugging (keep invisible)
    let ground = new THREE.Mesh(
      new THREE.PlaneGeometry(groundSizeX, groundSizeZ),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    );
    ground.material.opacity = 0;
    ground.material.transparent = true;
    ground.position.set(0, 0, 0);
    ground.rotateX(-Math.PI / 2);
    globals.threeScene.add(ground);

    // Add walls around the ground perimeter - dinamik pozisyonlama
    const wallHeight = 100;
    const wallThickness = 0.2;

    // North wall (positive Z) - ground size'a göre otomatik pozisyonlama
    let northWall = new THREE.Mesh(
      new THREE.BoxGeometry(groundSizeX, wallHeight, wallThickness),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    northWall.position.set(0, wallHeight / 2, this.groundHalfZ + 2); // Ground'un z pozisyonuna göre ayarla
    globals.threeScene.add(northWall);
    northWall.body = this.physicsManager.createBodyFromObject(northWall, {
      type: 'static',
      mass: 0,
    });

    // South wall (negative Z) - ground size'a göre otomatik pozisyonlama
    let southWall = new THREE.Mesh(
      new THREE.BoxGeometry(groundSizeX, wallHeight, wallThickness),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    southWall.position.set(0, wallHeight / 2, -this.groundHalfZ + 2); // Ground'un z pozisyonuna göre ayarla
    globals.threeScene.add(southWall);
    southWall.body = this.physicsManager.createBodyFromObject(southWall, {
      type: 'static',
      mass: 0,
    });

    // East wall (positive X) - ground size'a göre otomatik pozisyonlama
    let eastWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, groundSizeZ),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    eastWall.position.set(this.groundHalfX, wallHeight / 2, 2); // Ground'un z pozisyonuna göre ayarla
    globals.threeScene.add(eastWall);
    eastWall.body = this.physicsManager.createBodyFromObject(eastWall, {
      type: 'static',
      mass: 0,
    });

    // West wall (negative X) - ground size'a göre otomatik pozisyonlama
    let westWall = new THREE.Mesh(
      new THREE.BoxGeometry(wallThickness, wallHeight, groundSizeZ),
      new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0.0,
        transparent: true,
      })
    );
    westWall.position.set(-this.groundHalfX, wallHeight / 2, 2); // Ground'un z pozisyonuna göre ayarla
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
    const scaleRatio = 0.6 - diff * 0.1; // Platform scale ratio

    // Objenin mevcut scale'ini al ve ratio'yu uygula
    const currentScale = obj.scale.x; // x, y, z aynı olduğunu varsayıyoruz
    const targetScale = currentScale * scaleRatio;

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
      x: currentScale + 0.3,
      y: currentScale + 0.3,
      z: currentScale + 0.3,
      duration: 0.25,
      ease: 'sine.inOut',
      onComplete: () => {
        gsap.to(obj.scale, {
          x: targetScale,
          y: targetScale,
          z: targetScale,
          duration: 0.25,
          onComplete: () => {
            // Platform landing sound
            if (AudioManager) {
              AudioManager.playSFX('platform');
            }

            // Bounce effect
            gsap.to(obj.scale, {
              x: targetScale * 1.2,
              y: targetScale * 1.2,
              z: targetScale * 1.2,
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

    const platformScale = scalar - diff * 0.01;
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
      platform.position.set(i * offset, 0, 1.5);
      platform.scale.set(platformScale, platformScale, platformScale);
      platform.rotation.x = Math.PI / 4;
      platform.oScale = platformScale;
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
    tray.position.z = 11;
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

  tornado() {
    // Tüm map objelerine tornado efekti uygula

    // Tornado efektinin sürekli olması için interval kullan (5 saniye)
    if (this.tornadoInterval) {
      clearInterval(this.tornadoInterval);
    }

    this.tornadoInterval = setInterval(() => {
      this.applyTornadoForces();
    }, 50); // Her 50ms'de bir kuvvet uygula

    // 5 saniye sonra tornado'yu durdur
    setTimeout(() => {
      if (this.tornadoInterval) {
        clearInterval(this.tornadoInterval);
        this.tornadoInterval = null;
        console.log('Tornado ended');
      }
    }, 2500);
  }

  // Tornado kuvvetlerini sürekli uygulayan yardımcı metod
  applyTornadoForces() {
    const tornadoStrength = 100; // Sürekli efekt için dairesel hareket gücü artırıldı
    const upwardForce = 20;
    const centerPoint = new THREE.Vector3(0, 0, 0);
    const maxTornadoDistance = 300; // Maksimum tornado etki mesafesi (yeni!)

    this.mapObjects.forEach((mapObject) => {
      if (!mapObject.body) return;

      // Angular damping'i artır (objelerin dönmesini yavaşlatır)
      // mapObject.body.angularDamping = 0.8; // 0-1 arası, yüksek değer daha fazla dampening

      const objPosition = new THREE.Vector3(
        mapObject.body.position.x,
        mapObject.body.position.y,
        mapObject.body.position.z
      );

      const radialVector = objPosition.clone().sub(centerPoint);
      const distance = radialVector.length();

      // Distance kontrolü güncellendi
      if (distance < 0.5 || distance > maxTornadoDistance) return; // 0.1'den 0.5'e artırıldı

      // Dairesel hareket
      const tangentVector = new THREE.Vector3(
        -radialVector.z,
        0,
        radialVector.x
      ).normalize();

      // Merkeze çekme - daha az çekme kuvveti
      const pullVector = radialVector.clone().normalize().multiplyScalar(-2);

      // Distance multiplier güncellendi - uzak objeler için daha iyi
      const distanceMultiplier = Math.max(0.2, Math.min(1.5, 15 / distance)); // 10'dan 15'e artırıldı, min 0.3
      const tangentForce = tangentVector.multiplyScalar(
        tornadoStrength * distanceMultiplier
      );
      const upwardForceVector = new THREE.Vector3(
        0,
        upwardForce * distanceMultiplier,
        0
      );

      // Kuvveti kütle merkezine uygula (dönmeyi azaltır)
      mapObject.body.applyForce(
        new CANNON.Vec3(
          tangentForce.x + pullVector.x * 0.3, // Pull kuvvetini daha da azalt
          upwardForceVector.y,
          tangentForce.z + pullVector.z * 0.3
        ),
        new CANNON.Vec3(0, 0, 0) // Kütle merkezine uygula (yerel koordinat sistemi)
      );

      // Angular velocity'i tamamen sıfırlamak yerine yumuşak bir şekilde azalt
      mapObject.body.angularVelocity.scale(0.9); // Mevcut dönme hızını yarıya indir
    });
  }

  magnet() {
    // magnetSprite yoksa çık
    if (!globals.pixiGame.magnetSprite) {
      console.log('magnetSprite bulunamadı!');
      return;
    }

    // 2D sprite pozisyonunu dünya koordinatlarına çevir
    const magnetSprite = globals.pixiGame.magnetSprite;
    const spriteWorldPos = magnetSprite.getGlobalPosition();

    // 3D dünya koordinatlarına çevir
    const worldPos = this.touchTransformer.getPlaneIntersection(
      spriteWorldPos.x,
      spriteWorldPos.y
    );

    // Sadece 3 veya daha fazla objeye sahip tipleri filtrele
    const typeGroups = this.mapObjects.reduce((groups, obj) => {
      if (!groups[obj.objectType]) {
        groups[obj.objectType] = [];
      }
      groups[obj.objectType].push(obj);
      return groups;
    }, {});

    // 3 veya daha fazla objeye sahip tipleri bul
    const availableTypes = Object.keys(typeGroups).filter(
      (type) => typeGroups[type].length >= 3
    );

    if (availableTypes.length === 0) {
      console.log('Magnet için en az 3 adet objeye sahip tip bulunamadı!');
      return;
    }

    const selectedType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const objectsToMagnet = typeGroups[selectedType].slice(0, 3);

    console.log(
      `3 adet ${selectedType} tipinde obje magnet pozisyonuna çekiliyor...`
    );

    // Ses efekti çal
    if (AudioManager) {
      AudioManager.playSFX('collect');
    }

    // Her obje için magnet işlemi
    objectsToMagnet.forEach((obj, index) => {
      // Physics body'yi kaldır
      if (obj.body) {
        globals.physicsManager.world.removeBody(obj.body);
        obj.body = null;
      }

      // mapObjects array'inden çıkar
      const objectIndex = this.mapObjects.indexOf(obj);
      if (objectIndex > -1) {
        this.mapObjects.splice(objectIndex, 1);
      }

      // Mevcut animasyonları durdur
      gsap.killTweensOf(obj.rotation);
      gsap.killTweensOf(obj.scale);
      gsap.killTweensOf(obj.position);

      // Her obje için farklı delay ve offset
      const delay = index * 0.15;
      const offsetX = (Math.random() - 0.5) * 1;
      const offsetZ = (Math.random() - 0.5) * 1;
      const dest = {
        x: worldPos.x + offsetX,
        y: worldPos.y,
        z: worldPos.z + offsetZ,
      };

      // X-axis movement - smooth horizontal slide (gather stilinde)
      gsap.to(obj.position, {
        x: dest.x,
        duration: 0.4,
        delay: delay,
        ease: 'sine.inOut',
      });

      // Z-axis movement - gather stilindeki karmaşık animasyon
      gsap.to(obj.position, {
        z: dest.z,
        duration: 0.4,
        delay: delay,
        ease: 'power1.in',
        onComplete: () => {
          // Zıplama animasyonlarını kaldır - direkt objeyi scene'den çıkar
          globals.threeScene.remove(obj);
          console.log(`Obje ${obj.objectType} magnet tarafından toplandı!`);
        },
      });

      // Y-axis movement - parabolic arc (gather stilinde)
      gsap.to(obj.position, {
        y: dest.y + 3,
        duration: 0.2,
        delay: delay,
        ease: 'sine.in',
        onComplete: () => {
          gsap.to(obj.position, {
            y: dest.y,
            duration: 0.2,
            ease: 'sine.out',
          });
        },
      });

      // Rotation animation - gather stilinde align
      gsap.to(obj.rotation, {
        x: -Math.PI / 2,
        y: 0,
        z: 0,
        duration: 0.3,
        delay: delay,
        ease: 'sine.inOut',
      });

      // Scale animation - gather stilindeki 3-stage: grow, shrink, bounce
      gsap.to(obj.scale, {
        x: '+=0.3',
        y: '+=0.3',
        z: '+=0.3',
        duration: 0.25,
        delay: delay,
        ease: 'sine.inOut',
        onComplete: () => {
          // Objenin mevcut scale'ini al ve ratio'yu uygula (magnet için)
          const currentScale = obj.scale.x;
          const magnetScaleRatio = 0.6; // Magnet scale ratio
          const magnetTargetScale = currentScale * magnetScaleRatio;

          gsap.to(obj.scale, {
            x: magnetTargetScale,
            y: magnetTargetScale,
            z: magnetTargetScale,
            duration: 0.25,
            onComplete: () => {
              // Bounce effect
              gsap.to(obj.scale, {
                x: magnetTargetScale * 1.2,
                y: magnetTargetScale * 1.2,
                z: magnetTargetScale * 1.2,
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
    });
  }

  reverse() {
    console.log('Reverse powerup clicked');

    // Tray'de obje yoksa çık
    if (this.tray.length === 0) {
      console.log("Tray'de geri döndürülecek obje bulunamadı!");
      return;
    }

    // Tray'deki son objeyi al
    const lastObject = this.tray[this.tray.length - 1];
    console.log("Tray'deki son obje geri döndürülüyor:", lastObject.objectType);

    // Tüm animasyonları durdur
    gsap.killTweensOf(lastObject.rotation);
    gsap.killTweensOf(lastObject.scale);
    gsap.killTweensOf(lastObject.position);

    // Objeyi tray'den çıkar
    this.tray.splice(this.tray.length - 1, 1);

    // onTray array'inden de çıkar (eğer oradaysa)
    const onTrayIndex = this.onTray.indexOf(lastObject);
    if (onTrayIndex > -1) {
      this.onTray.splice(onTrayIndex, 1);
    }

    // Platform referansını temizle
    if (lastObject.platform) {
      lastObject.platform = null;
    }

    // Objeyi trayObj'den detach et (attach() ile bağlandığı için detach() kullan)
    if (lastObject.parent === this.trayObj) {
      this.scene.attach(lastObject); // Ana scene'e attach et
      lastObject.isTapped = false;
      lastObject.isReversed = true;
    }

    // Ground collider alanı içinde güvenli pozisyon oluştur (x ve z için)
    const safePos = this.getSafePosition(1.5);
    const targetPosition = new THREE.Vector3(safePos.x, 2, safePos.z);

    // GSAP ile pozisyon animasyonu
    gsap.to(lastObject.position, {
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      duration: 0.8,
      ease: 'back.out(1.7)',
      onComplete: () => {
        // Animasyon tamamlandıktan sonra physics body'sini ekle
        lastObject.addPhysicsBody();

        // mapObjects array'ine geri ekle
        this.mapObjects.push(lastObject);
        console.log('mapObjects', lastObject.objectType);

        console.log(
          `Obje ${lastObject.objectType} pozisyonu (${targetPosition.x.toFixed(
            2
          )}, ${targetPosition.y.toFixed(2)}, ${targetPosition.z.toFixed(
            2
          )}) konumuna geri döndürüldü`
        );
      },
    });

    // Rotasyon animasyonu - tray'deki rotasyondan normale döndür
    gsap.to(lastObject.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.6,
      ease: 'sine.inOut',
    });

    // Scale animasyonu - orijinal scale'e döndür
    gsap.to(lastObject.scale, {
      x: lastObject.originalScale,
      y: lastObject.originalScale,
      z: lastObject.originalScale,
      duration: 0.5,
      ease: 'back.out(1.7)',
    });

    // Tray'i yeniden düzenle
    this.sortAssign();

    // Ses efekti çal
    if (AudioManager) {
      AudioManager.playSFX('upgrade');
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

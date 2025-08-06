import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import globals from '../../globals';
import { assetLoader } from '../asset_loader';
import data from '../../src/config/data';
import QuarksPool from '../utils/QuarksPool';

export class ThreeRenderer {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(data.threeBgColor);
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    globals.threeCamera = this.camera;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true, // Make background transparent
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    // Enable shadows
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Set renderer to be behind Pixi canvas and make it non-interactive
    this.renderer.domElement.style.position = 'absolute';
    this.renderer.domElement.style.zIndex = '0';
    this.renderer.domElement.style.pointerEvents = 'none'; // Disable pointer events
    this.renderer.domElement.style.userSelect = 'none'; // Prevent text selection
    this.renderer.domElement.style.touchAction = 'none'; // Disable touch actions

    // Basic light setup with shadows
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(0, 20, -1);
    directionalLight.target.position.set(0, 0, 2); // Target objeler üzerine
    directionalLight.castShadow = true;
    this.directionalLight = directionalLight;

    // Hemisphere light for better plastic appearance
    const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6);
    this.hemisphereLight = hemisphereLight;

    // Configure shadow properties
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    directionalLight.shadow.bias = -0.001;
    globals.directionalLight = directionalLight;

    // Add helper to visualize shadow camera (uncomment for debugging)
    const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    //  this.scene.add(helper);

    this.scene.add(
      ambientLight,
      directionalLight,
      directionalLight.target,
      hemisphereLight
    );

    // Position camera
    this.camera.position.z = 5;

    // Initialize loader and models
    this.gltfLoader = new GLTFLoader();
    this.models = {};

    globals.quarksPool = new QuarksPool(this.scene);
  }

  get view() {
    return this.renderer.domElement;
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    // if (width > height) {
    //   // console.log("landscape");
    //   this.camera.fov = data.camFov / 2;
    //   this.camera.updateProjectionMatrix();
    // } else {
    //   // console.log("portrait");
    //   this.camera.fov = data.camFov;
    //   this.camera.updateProjectionMatrix();
    // }
  }

  update(delta) {
    // Update any animations or model movements here
    for (const modelName in this.models) {
      const model = this.models[modelName];
      if (model.mixer) {
        model.mixer.update(delta);
      }
    }
    this.renderer.render(this.scene, this.camera);
    if (globals.quarksPool && globals.quarksPool.update) {
      globals.quarksPool.update(delta);
    }
  }
}

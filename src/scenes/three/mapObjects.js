import * as THREE from 'three';
import globals from '../../../globals';
import gsap from 'gsap';
import AudioManager from '../../../engine/audio/AudioManager';
import data from '../../config/data';
import * as CANNON from 'cannon-es';
import { mod } from 'three/tsl';

export default class MapObject extends THREE.Object3D {
  constructor(model, scale, position = new THREE.Vector3(0, 0, 0), objectType) {
    super();
    this.animations = {};
    this.model = globals.cloneModel(model);

    // Modelin tüm mesh'lerinde gölge ayarlarını etkinleştir
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    this.originalScale = scale; // Orijinal scale'i sakla
    this.scale.setScalar(scale);
    this.add(this.model);
    this.position.copy(position);
    // this.rotation.copy(rotation);
    globals.threeScene.add(this);
    this.body = null;
    this.objectType = objectType;
    this.addPhysicsBody();
  }

  addPhysicsBody() {
    // Eğer mevcut bir physics body varsa önce onu temizle
    if (this.body) {
      globals.physicsManager.world.removeBody(this.body);
      this.body = null;
    }

    this.body = globals.physicsManager.createBodyFromObject(this.model, {
      type: 'dynamic',
      mass: 1.5,
      sizeMultiplier: new THREE.Vector3(1, 1, 1),
    });
    this.body.position.copy(this.position);
    // Quaternion'ı da kopyala
    this.body.quaternion.copy(this.quaternion);

    // Düşük sürtünme ve yüksek sekme için materyal oluştur
    const bouncyMaterial = new CANNON.Material('bouncy');
    bouncyMaterial.friction = 0; // Düşük sürtünme (0-1 arası, 0 = sürtünmesiz)
    bouncyMaterial.restitution = 0.1; // Yüksek sekme (0-1 arası, 1 = tam sekme)

    //Materyali physics body'ye ata
    this.body.material = bouncyMaterial;

    this.body.linearDamping = 0.7; // Hareketi yavaş yavaş durdur
    this.body.angularDamping = 0.7; // Dönmeyi yavaş yavaş durdur
  }

  update(ratio, delta) {
    // Body yoksa update yapma
    if (!this.body) return;

    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);
  }
}

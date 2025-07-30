import * as THREE from 'three';
import globals from '../../../globals';
import gsap from 'gsap';
import AudioManager from '../../../engine/audio/AudioManager';
import data from '../../config/data';
import * as CANNON from 'cannon-es';

export default class MapObject extends THREE.Object3D {
  constructor(
    model,
    scale = 1,
    position = new THREE.Vector3(0, 0, 0),
    objectType
  ) {
    super();
    this.animations = {};
    this.model = globals.cloneModel(model);
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
    this.body = globals.physicsManager.createBodyFromObject(this.model, {
      type: 'dynamic',
      mass: 0.5,
      sizeMultiplier: new THREE.Vector3(1, 1, 1),
    });
    this.body.position.copy(this.position);
    // Quaternion'ı da kopyala
    this.body.quaternion.copy(this.quaternion);

    // Düşük sürtünme ve yüksek sekme için materyal oluştur
    const bouncyMaterial = new CANNON.Material('bouncy');
    bouncyMaterial.friction = 0; // Düşük sürtünme (0-1 arası, 0 = sürtünmesiz)
    bouncyMaterial.restitution = 1; // Yüksek sekme (0-1 arası, 1 = tam sekme)

    // Materyali physics body'ye ata
    this.body.material = bouncyMaterial;

    // // Rastgele başlangıç hareketi ver
    const randomImpulse = new CANNON.Vec3(
      (Math.random() - 0.5) * 1, // X yönünde rastgele hareket (-10 ile +10 arası)
      0, // Y yönünde yukarı doğru hareket (5-15 arası)
      (Math.random() - 0.5) * 1 // Z yönünde rastgele hareket (-10 ile +10 arası)
    );

    this.body.applyLocalImpulse(randomImpulse);

    this.body.linearDamping = 0.05; // Hareketi yavaş yavaş durdur
    this.body.angularDamping = 0.05; // Dönmeyi yavaş yavaş durdur
  }

  update(ratio, delta) {
    // Body yoksa update yapma
    if (!this.body) return;

    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);
  }
}

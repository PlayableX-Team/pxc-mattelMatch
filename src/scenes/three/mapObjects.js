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

    // Önce boş body oluştur
    this.body = new CANNON.Body({
      mass: 1.5,
      type: CANNON.Body.DYNAMIC,
      position: new CANNON.Vec3(
        this.position.x,
        this.position.y,
        this.position.z
      ),
    });

    // Model geometrisinin bounding box'ını hesapla
    const boundingBox = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    boundingBox.getSize(size);
    boundingBox.getCenter(center);

    console.log('Model center:', center);
    console.log('Model size:', size);

    // Physics shape oluştur
    const shape = new CANNON.Box(
      new CANNON.Vec3(size.x * 3.3, size.y * 3.3, size.z * 3.3)
    );

    // Shape'i SIFIR offset ile ekle (shape merkezini body merkezine hizala)
    this.body.addShape(shape, new CANNON.Vec3(0, 0, 0));

    // Model merkezini physics body merkezine taşı
    // Model pivot'ı center kadar offsetli ise, modeli o kadar ters yönde kaydır
    this.model.position.set(-center.x, -center.y, -center.z);

    console.log('Model offset applied:', -center.x, -center.y, -center.z);

    // Quaternion'ı da kopyala
    this.body.quaternion.copy(this.quaternion);

    // Düşük sürtünme ve yüksek sekme için materyal oluştur
    const bouncyMaterial = new CANNON.Material('bouncy');
    bouncyMaterial.friction = 0;
    bouncyMaterial.restitution = 0.1;

    this.body.material = bouncyMaterial;
    this.body.linearDamping = 0.7;
    this.body.angularDamping = 0.7;

    // World'e ekle
    globals.physicsManager.world.addBody(this.body);
  }

  // Rotasyonu ayarla ve physics body'yi güncelle
  setRotation(x, y, z) {
    this.rotation.set(x, y, z);
    if (this.body) {
      this.body.quaternion.copy(this.quaternion);
    }
  }

  update(ratio, delta) {
    // Body yoksa update yapma
    if (!this.body) return;

    // Physics body pozisyonunu direkt kopyala
    // Model artık doğru pozisyonda olmalı
    this.position.copy(this.body.position);
    this.quaternion.copy(this.body.quaternion);
  }
}

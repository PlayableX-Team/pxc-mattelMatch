import globals from '../../../globals';
import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import data from '../../config/data';
import * as THREE from 'three.quarks';
import * as Particles from '@pixi/particle-emitter';

const TextureCache = PIXI.utils.TextureCache;
import AudioManager from '../../../engine/audio/AudioManager';

export default class Powerup {
  constructor(
    parent,
    asset,
    type,
    scale = 1,
    count,
    posXPowerUp,
    posYPowerUp,
    grayAsset,
    grayScale
  ) {
    this.count = count;
    this.asset = asset;
    this.scale = scale;
    this.parent = parent;
    this.posXPowerUp = posXPowerUp;
    this.posYPowerUp = posYPowerUp;
    this.type = type;
    this.sprite = null;
    this.counterText = null;
    this.grayAsset = grayAsset;
    this.grayScale = grayScale;
    // Powerup konfigürasyonları
    this.powerupConfigs = {
      magnet: {
        canActivate: () => this.count > 0,
        action: () => {},
      },
      reverse: {
        canActivate: () => this.count > 0 && globals.threeGame.tray.length > 0,
        action: () => {
          AudioManager.playSFX('reverse');
          globals.threeGame.reverse();
          gsap.delayedCall(0.1, () => {
            this.checkReverseGrayAsset();
          });
        },
      },
      time: {
        canActivate: () => this.count > 0 && globals.pixiGame.isTimerRunning,
        action: () => {
          AudioManager.playSFX('time');
          globals.pixiGame.pauseTimer();
          globals.pixiGame.timerBgAnimation();
          globals.pixiGame.addGlow();
          globals.pixiGame.timerPowerUpTextOpen();
          this.grayAsset.visible = true;
          this.button.visible = false;
          gsap.delayedCall(data.timerPowerUpEffect, () => {
            globals.pixiGame.resumeTimer();
            globals.pixiGame.stopTimerBgAnimation();
            globals.pixiGame.stopGlow();
            globals.pixiGame.timerPowerUpTextClose();
            this.checkGrayAsset();
          });
          console.log('Time powerup clicked');
        },
      },
      tornado: {
        canActivate: () => this.count > 0,
        action: () => {
          this.grayAsset.visible = true;
          this.button.visible = false;
          gsap.delayedCall(data.timerPowerUpEffect, () => {
            this.checkGrayAsset();
          });
        },
      },
    };

    this.init();
  }

  init() {
    console.log('Powerup constructor');

    const button = PIXI.Sprite.from(TextureCache[this.asset]);
    this.sprite = button;
    button.anchor.set(0.5);
    button.scale.set(this.scale);
    this.parent.addChild(button);
    button.position.set(this.posXPowerUp, this.posYPowerUp);
    button.interactive = true;
    button.buttonMode = true;
    this.button = button;

    const grayAsset = PIXI.Sprite.from(TextureCache[this.grayAsset]);
    this.parent.addChild(grayAsset);
    grayAsset.position.set(this.posXPowerUp, this.posYPowerUp);
    grayAsset.scale.set(this.grayScale);
    grayAsset.anchor.set(0.5);
    this.grayAsset = grayAsset;
    this.checkGrayAsset();

    // Tek bir event handler
    button.on('pointerdown', () => this.activatePowerup());

    // Counter UI oluşturma
    this.createCounterUI();
    this.checkReverseGrayAsset();
  }

  checkReverseGrayAsset() {
    if (this.type === 'reverse') {
      if (globals.threeGame.tray.length === 0) {
        this.grayAsset.visible = true;
        this.button.visible = false;
      } else if (globals.threeGame.tray.length > 0 && this.count > 0) {
        this.grayAsset.visible = false;
        this.button.visible = true;
      }
    }
  }

  checkGrayAsset() {
    if (this.count > 0) {
      this.grayAsset.visible = false;
      this.button.visible = true;
    } else {
      this.grayAsset.visible = true;
      this.button.visible = false;
    }
  }

  // Magnet butonu için özel animasyon
  animateMagnetButton(button, onComplete) {
    button.interactive = false;

    // Başlangıç değerlerini kaydet
    const originalY = button.y;
    const originalScaleX = button.scale.x;
    const originalScaleY = button.scale.y;
    const originalRotation = button.rotation;

    // Animasyon zinciri oluştur
    const timeline = gsap.timeline({
      onComplete: () => {
        button.interactive = true;
        if (onComplete) onComplete();
      },
    });
    gsap.delayedCall(0.5, () => {
      globals.threeGame.magnet();
      AudioManager.playSFX('magnet');
    });

    // 1. Buton 100 birim ileri gider
    timeline.to(button, {
      y: originalY - 100,
      rotation: originalRotation + (30 * Math.PI) / 180, // 60 derece radyana çevir
      duration: 0.3,
      ease: 'power2.out',
      delay: 0.2,
    });
    // 2. Scale %10 artar ve 60 derece döner
    timeline.to([button.scale, button], {
      scaleX: originalScaleX * 1.1,
      scaleY: originalScaleY * 1.1,
      duration: 0.15,
      ease: 'power2.out',
      onStart: () => {
        this.magnetEffect(button);
      },
    });

    // 3. Scale orijinal haline döner ve rotasyon da orijinal haline döner
    timeline.to([button.scale, button], {
      scaleX: originalScaleX,
      scaleY: originalScaleY,
      duration: 0.15,
      ease: 'power2.out',
      delay: 0.3,
    });

    // 4. Başlangıç pozisyonuna geri döner
    timeline.to(button, {
      y: originalY,
      duration: 0.3,
      rotation: originalRotation,

      ease: 'power2.out',
      delay: 0.3,
    });
  }

  animateTornadoButton(button, onComplete) {
    button.interactive = false;

    // Başlangıç değerlerini kaydet
    const originalY = button.y;
    const originalScaleX = button.scale.x;
    const originalScaleY = button.scale.y;
    const originalRotation = button.rotation;

    // Animasyon zinciri oluştur
    const timeline = gsap.timeline({
      onComplete: () => {
        button.interactive = true;
        if (onComplete) onComplete();
      },
    });

    // 1. Buton 100 birim yukarı gider
    timeline.to(button, {
      y: originalY - 100,
      duration: 0.3,
      ease: 'power2.out',
    });

    // // 2. Rotasyon -60 ile +60 arasında değişim (tornado etkisi)
    // timeline.to(button, {
    //   rotation: originalRotation - (0 * Math.PI) / 180, // -60 derece
    //   duration: 0.5,
    //   ease: 'power2.out',
    // });

    timeline.to(button, {
      rotation: originalRotation + (60 * Math.PI) / 180, // +60 derece
      duration: 0.8,
      ease: 'power2.out',
      onStart: () => {
        globals.threeGame.tornado();
        this.tornadoEffect(button);
        AudioManager.playSFX('tornado');
      },
    });

    // 3. Orijinal pozisyon ve rotasyonuna geri döner
    timeline.to(button, {
      y: originalY,
      rotation: originalRotation,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  animateReverseButton(button, onComplete) {
    // Butonun interaktifliğini geçici olarak kapat
    button.interactive = false;

    // Orijinal değerleri kaydet
    const originalY = button.y;
    const originalRotation = button.rotation;

    // Animasyon zinciri oluştur
    const timeline = gsap.timeline({
      onComplete: () => {
        button.interactive = true;
        if (onComplete) onComplete();
      },
    });

    // 1. Buton 100 birim yukarı gider
    timeline.to(button, {
      y: originalY - 100,
      duration: 0.3,
      ease: 'power2.out',
    });

    // 2. Kendi etrafında 4 tam tur atar (4 * 360 derece = 1440 derece)
    timeline.to(button, {
      rotation: originalRotation + (1440 * Math.PI) / 180, // 4 tam tur
      duration: 1.2,
      ease: 'power2.inOut',
    });

    // 3. Orijinal pozisyon ve rotasyonuna geri döner
    timeline.to(button, {
      y: originalY,
      rotation: originalRotation,
      duration: 0.3,
      ease: 'power2.out',
    });
  }

  animateTimeButton(button, onComplete) {
    // Butonun interaktifliğini geçici olarak kapat
    button.interactive = false;

    // Orijinal değerleri kaydet
    const originalY = button.y;
    const originalRotation = button.rotation;

    // Animasyon zinciri oluştur
    const timeline = gsap.timeline({
      onComplete: () => {
        button.interactive = true;
        if (onComplete) onComplete();
      },
    });

    // 1. Buton 100 birim yukarı gider
    timeline.to(button, {
      y: originalY - 100,
      duration: 0.3,
      ease: 'power2.out',
    });

    // 2. 260 derece döner
    timeline.to(button, {
      rotation: originalRotation + (360 * Math.PI) / 180, // 260 derece
      duration: 0.8,
      ease: 'power2.inOut',
    });

    // 3. Orijinal pozisyon ve rotasyonuna geri döner
    timeline.to(button, {
      y: originalY,
      //rotation: originalRotation,
      duration: 0.3,
      delay: 0.3,
      ease: 'power2.out',
    });
  }

  magnetEffect(button) {
    // Manyetik alan efekti için container oluştur
    const magnetFieldContainer = new PIXI.Container();
    this.parent.addChild(magnetFieldContainer);

    // Butonun pozisyonunu al
    const buttonX = button.x;
    const buttonY = button.y;

    // Dalgalanma efekti için dış halka
    const outerRing = new PIXI.Graphics();
    outerRing.lineStyle(3, 0x00ffff, 0.5);
    outerRing.drawCircle(0, 0, 120);
    outerRing.x = buttonX;
    outerRing.y = buttonY;
    magnetFieldContainer.addChild(outerRing);

    // Dış halka animasyonu
    gsap.fromTo(
      outerRing.scale,
      { x: 0.5, y: 0.5 },
      {
        x: 1.5,
        y: 1.5,
        duration: 2,
        ease: 'power2.out',
      }
    );

    gsap.to(outerRing, {
      alpha: 0,
      duration: 1,
      ease: 'power2.out',
    });

    // İç halka - daha hızlı animasyon
    const innerRing = new PIXI.Graphics();
    innerRing.lineStyle(2, 0x00ffff, 0.8);
    innerRing.drawCircle(0, 0, 60);
    innerRing.x = buttonX;
    innerRing.y = buttonY;
    magnetFieldContainer.addChild(innerRing);

    // İç halka animasyonu
    gsap.fromTo(
      innerRing.scale,
      { x: 0.8, y: 0.8 },
      {
        x: 1.2,
        y: 1.2,
        duration: 1,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
      }
    );

    // Tüm efekti 3 saniye sonra temizle
    gsap.delayedCall(0.5, () => {
      gsap.to(magnetFieldContainer, {
        alpha: 0,
        duration: 0.5,
        onComplete: () => {
          this.parent.removeChild(magnetFieldContainer);
          magnetFieldContainer.destroy();
        },
      });
    });
  }

  tornadoEffect(button) {
    console.log('tornadoEffect called with button:', button);
    console.log('TextureCache cartoonSmoke:', TextureCache['cartoonSmoke']);

    // Basit PIXI.js sprite'larla particle efekti oluştur
    const parent = this.parent;
    const cont = new PIXI.Container();
    parent.addChild(cont);

    // Butonun pozisyonunu kullan
    const buttonX = button.x;
    const buttonY = button.y - 100;
    cont.position.set(buttonX, buttonY);

    console.log('Container position:', buttonX, buttonY);

    // Konfigürasyona göre particle sistemi
    const particles = [];
    const config = {
      lifetime: { min: 0.5, max: 0.7 },
      frequency: 0.008,
      emitterLifetime: 0.15,
      maxParticles: 50, // 500'den düşürdük performans için
      speed: { min: 200, max: 600 },
      scale: { start: 0.1, end: 1 },
      rotation: { min: 260, max: 280 }, // derece cinsinden
    };

    // Particle spawn timer
    let spawnTimer = 0;
    const spawnInterval = config.frequency;
    let emitterTime = 0;

    const createParticle = () => {
      // cartoonSmoke texture'ı varsa kullan, yoksa basit bir graphic oluştur
      let particle;

      if (TextureCache['cartoonSmoke']) {
        particle = PIXI.Sprite.from(TextureCache['cartoonSmoke']);
      }

      particle.anchor.set(0.5);
      particle.scale.set(config.scale.start);
      particle.alpha = 1.0; // Başlangıçta tam opak

      // Spawn point - merkezde başla
      particle.x = 0;
      particle.y = 0;

      // Hareket yönü ve hızı
      const angle =
        (config.rotation.min +
          Math.random() * (config.rotation.max - config.rotation.min)) *
        (Math.PI / 180);
      const speed =
        config.speed.min +
        Math.random() * (config.speed.max - config.speed.min);

      const lifetime =
        config.lifetime.min +
        Math.random() * (config.lifetime.max - config.lifetime.min);

      cont.addChild(particle);

      const particleData = {
        sprite: particle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        lifetime: lifetime,
        age: 0,
        initialSpeed: speed,
        rotationSpeed: Math.random() * 20 * (Math.PI / 180), // 0-20 derece/saniye
      };

      particles.push(particleData);
    };

    console.log('Tornado effect initialized');

    // Particle animasyonu
    const animateParticles = () => {
      const deltaTime = 0.016; // 60fps varsayarak
      emitterTime += deltaTime;
      spawnTimer += deltaTime;

      // Yeni particle spawn et (emitter lifetime boyunca)
      if (
        emitterTime < config.emitterLifetime &&
        spawnTimer >= spawnInterval &&
        particles.length < config.maxParticles
      ) {
        createParticle();
        spawnTimer = 0;
      }

      // Mevcut particle'ları güncelle
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += deltaTime;

        // Lifetime kontrolü
        if (p.age >= p.lifetime) {
          cont.removeChild(p.sprite);
          p.sprite.destroy();
          particles.splice(i, 1);
          continue;
        }

        // Animasyon progress'i (0-1)
        const progress = p.age / p.lifetime;

        // Pozisyon güncelle
        p.sprite.x += p.vx * deltaTime;
        p.sprite.y += p.vy * deltaTime;

        // Hız azalması (600'den 200'e)
        const currentSpeed = p.initialSpeed * (1 - progress * 0.67); // %67 azalma
        const speedRatio = currentSpeed / p.initialSpeed;
        p.sprite.x += p.vx * deltaTime * speedRatio;
        p.sprite.y += p.vy * deltaTime * speedRatio;

        // Rotasyon güncelle
        p.sprite.rotation += p.rotationSpeed * deltaTime;

        // Scale güncelle (0.1'den 1.5'e)
        const currentScale =
          config.scale.start +
          (config.scale.end - config.scale.start) * progress;
        p.sprite.scale.set(currentScale);

        // Alpha güncelle (1'den 0'a)
        p.sprite.alpha = 1 - progress;
      }
    };

    // Animation loop
    const ticker = new PIXI.Ticker();
    ticker.add(animateParticles);
    ticker.start();

    // Emitter lifetime + particle lifetime sonra temizle
    const totalDuration = config.emitterLifetime + config.lifetime.max;
    gsap.delayedCall(totalDuration + 1, () => {
      ticker.destroy();
      // Kalan particle'ları temizle
      particles.forEach((p) => {
        cont.removeChild(p.sprite);
        p.sprite.destroy();
      });
      parent.removeChild(cont);
      cont.destroy();
      console.log('Tornado effect cleaned up');
    });
  }

  // Count güncelleme için ortak metod
  updateCount() {
    this.count--;
    this.count = Math.max(0, this.count); // 0'ın altına inmemesi için
    this.counterText.text = this.count;
    this.checkGrayAsset();
  }

  // Powerup aktivasyonu için ortak metod
  activatePowerup() {
    if (globals.gameFinished) return;
    const config = this.powerupConfigs[this.type];
    AudioManager.playSFX('click');

    if (!config || !config.canActivate()) {
      return;
    }

    // Magnet ve Tornado için özel animasyonlar, diğerleri için normal işlem
    if (this.type === 'magnet') {
      this.animateMagnetButton(this.sprite, () => {
        this.updateCount();
        config.action();
      });
    } else if (this.type === 'tornado') {
      this.animateTornadoButton(this.sprite, () => {
        this.updateCount();
        config.action();
      });
    } else if (this.type === 'reverse') {
      this.animateReverseButton(this.sprite, () => {
        this.updateCount();
        config.action();
      });
    } else if (this.type === 'time') {
      this.animateTimeButton(this.sprite, () => {
        this.updateCount();
        config.action();
      });
    } else {
      this.updateCount();
      config.action();
    }
  }

  // Counter UI oluşturma metodunu ayrı çıkarıyoruz
  createCounterUI() {
    const counterBg = PIXI.Sprite.from(TextureCache['counterBg']);
    this.parent.addChild(counterBg);
    counterBg.position.set(
      this.posXPowerUp + data.counterBgPosX,
      this.posYPowerUp + data.counterBgPosY
    );
    counterBg.scale.set(data.counterBgScale);
    counterBg.anchor.set(0.5);

    this.counterText = new PIXI.Text(this.count, {
      fontFamily: 'game-font',
      fontSize: 24,
      fill: 'white',
      stroke: 'black',
      strokeThickness: 6,
    });
    counterBg.addChild(this.counterText);
    this.counterText.anchor.set(0.5);
    this.counterText.position.set(0, 0);
  }
}

import gsap from 'gsap';
import * as PIXI from 'pixi.js';
import { getDevicePlatform, openStorePage } from '../../../engine';
import globals from '../../../globals';
import Endcard from './Endcard';
// import { Spine } from "@pixi-spine/all-4.1";
import data from '../../config/data';
import AudioManager from '../../../engine/audio/AudioManager';
import Powerup from './powerup';
import * as THREE from 'three';
import RemainingObj from './remainingObj';

let pixiScene = null;
let pixiApp = null;

const TextureCache = PIXI.utils.TextureCache;

export default class PixiGame {
  constructor() {
    console.log('Game constructor');

    pixiScene = globals.pixiScene;
    pixiApp = globals.pixiApp;
    globals.pixiGame = this;
    this.magnetSprite = null;
    this.canHandPointer = false;
    this.isTimerRunning = false;
    this.text = null;
    this.timerProgress = 1.0; // 1'den başlayıp 0'a inecek
    this.timerDuration = data.gameTime; // 60 saniye
    this.timerContainer = null;
    this.timerMask = null;
    this.timerFillBar = null;
    this.timerText = null; // Timer text referansı
    this.remainingObjs = []; // RemainingObj referansları
  }

  start() {
    console.log('Game start pixi');

    // this.addBackground();
    // this.addHeaderText();

    globals.EventEmitter.on('gameFinished', () => {
      if (globals.gameFinished) return;
      pixiScene.children.forEach((child) => {
        gsap.to(child, {
          pixi: { alpha: 0 },
          duration: 0.5,
          ease: 'power2.out',
        });
      });
      new Endcard(true);
      globals.gameFinished = true;
      AudioManager.stopAllSFX();
    });

    // Object match eventi dinle
    globals.EventEmitter.on('objectMatched', (matchData) => {
      this.updateRemainingObjCount(matchData.objectType, matchData.count);
    });

    this.addPowerUpPanel();
    this.addUpsidePanel();
    this.addRemainingObjPanel();
    this.addHand();
    this.addTimeBg();

    gsap.delayedCall(4, () => {
      this.canHandPointer = true;
      this.hand.visible = true;
    });

    document.addEventListener('keydown', (event) => {
      if (event.key == 'e') {
        console.log('e');
        pixiScene.children.forEach((child) => {
          gsap.to(child, {
            pixi: { alpha: 0 },
            duration: 0.5,
            ease: 'power2.out',
          });
        });
        new Endcard(true);
      }
    });
  }

  addGlow() {
    // Farklı glow konfigürasyonları (pozisyon ve ölçek)
    const alpha = 0.8;
    const glowConfigs = [
      { x: 0.8, y: 0.2, scale: 0.5, alpha: alpha, rotation: 0 },
      { x: 0.5, y: 0.5, scale: 0.7, alpha: alpha, rotation: 0 },
      { x: 0.1, y: 0.8, scale: 0.6, alpha: alpha, rotation: 0 },
      { x: 0.7, y: 0.9, scale: 0.4, alpha: alpha, rotation: 0 },
      { x: 0.15, y: 0.5, scale: 0.7, alpha: alpha, rotation: 0 },
      { x: 0.85, y: 0.4, scale: 0.6, alpha: alpha, rotation: 0 },
      { x: 0.4, y: 0.8, scale: 0.3, alpha: alpha, rotation: 0 },
      { x: 0.6, y: 0.15, scale: 0.5, alpha: alpha, rotation: 0 },
      { x: 0.2, y: 0.1, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.9, y: 0.9, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.1, y: 0.8, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.7, y: 0.8, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.3, y: 0.3, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.7, y: 0.3, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.3, y: 0.7, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.7, y: 0.7, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.3, y: 0.7, scale: 0.2, alpha: alpha, rotation: 0 },
      { x: 0.7, y: 0.3, scale: 0.2, alpha: alpha, rotation: 0 },
    ];

    const glowContainer = new PIXI.Container();
    glowContainer.zIndex = 3000;
    pixiScene.addChild(glowContainer);

    this.glows = [];

    glowConfigs.forEach((config, index) => {
      const glow = PIXI.Sprite.from(TextureCache['Snow']);
      glow.anchor.set(0.5);
      glow.alpha = config.alpha;
      glow.rotation = config.rotation;

      glowContainer.addChild(glow);

      // Her glow için konfigürasyon sakla
      glow.config = config;
      this.glows.push(glow);
    });

    glowContainer.resize = (w, h) => {
      this.glows.forEach((glow) => {
        const baseX = w * glow.config.x;
        const baseY = h * glow.config.y;

        glow.position.set(baseX, baseY);
        glow.scale.set(glow.config.scale);

        // Animasyonları temizle
        gsap.killTweensOf(glow);

        // Her glow için random salınım hareketi ekle (kendi pozisyonu etrafında)
        const randomXOffset = (Math.random() - 0.5) * 100; // -7.5 ile +7.5 arası
        const randomYOffset = (Math.random() - 0.5) * 100; // -7.5 ile +7.5 arası
        const randomDuration = 2 + Math.random() * 3; // 2-5 saniye arası
        const randomDelay = Math.random() * 2; // 0-2 saniye arası gecikme

        // X ekseni salınımı (base pozisyon etrafında)
        gsap.to(glow, {
          x: baseX + randomXOffset,
          duration: randomDuration,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: randomDelay,
        });

        // Y ekseni salınımı (base pozisyon etrafında)
        gsap.to(glow, {
          y: baseY + randomYOffset,
          duration: randomDuration * 0.8,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: randomDelay * 0.5,
        });
      });
    };

    glowContainer.resize(window.innerWidth, window.innerHeight);
    this.glowContainer = glowContainer;
    glowContainer.alpha = 0;
    gsap.to(glowContainer, {
      alpha: 1,
      duration: 0.5,
      ease: 'power1.inOut',
    });
  }

  stopGlow() {
    gsap.killTweensOf(this.glowContainer);
    gsap.to(this.glowContainer, {
      alpha: 0,
      duration: 0.5,
      ease: 'power1.inOut',
    });
  }

  addTimeBg() {
    const blueBg = new PIXI.Sprite.from(TextureCache['blueBg']);
    blueBg.anchor.set(0.5);
    blueBg.position.set(window.innerWidth / 2, window.innerHeight / 2);
    blueBg.alpha = 0;
    pixiScene.addChild(blueBg);
    blueBg.zIndex = 300;

    blueBg.resize = (w, h) => {
      blueBg.width = w;
      blueBg.height = h;
      blueBg.position.set(w / 2, h / 2);
    };
    blueBg.resize(window.innerWidth, window.innerHeight);
    this.blueBg = blueBg;
  }

  timerBgAnimation() {
    gsap.killTweensOf(this.blueBg);
    // Başlangıç değerini 0.5 olarak ayarla
    gsap.to(this.blueBg, {
      alpha: 0.5,
      duration: 0.5,
      ease: 'power1.inOut',
      onComplete: () => {
        gsap.to(this.blueBg, {
          alpha: 1,
          duration: 1,
          yoyo: true,
          repeat: -1,
          ease: 'power1.inOut',
        });
      },
    });
  }

  stopTimerBgAnimation() {
    gsap.killTweensOf(this.blueBg);
    gsap.to(this.blueBg, {
      alpha: 0,
      duration: 0.5,
      ease: 'power1.inOut',
    });
  }

  addHand() {
    this.hand = PIXI.Sprite.from(TextureCache['hand']);
    this.hand.scale.set(data.handScale);
    this.hand.anchor.set(0.5); // Merkezi anchor yap
    this.hand.visible = false;

    gsap.to(this.hand.scale, {
      x: this.hand.scale.x * 0.9,
      y: this.hand.scale.y * 0.9,
      duration: 0.5,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });

    pixiScene.addChild(this.hand);
  }

  updateHandPosition() {
    // ThreeGame ve mapObjects'in hazır olup olmadığını kontrol et
    if (!globals.threeGame || !globals.threeGame.mapObjects) {
      // ThreeGame henüz hazır değilse ekranın ortasına yerleştir
      this.hand.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);
      return;
    }

    // Type = 5 olan objeleri filtrele
    const type5Objects = globals.threeGame.mapObjects.filter(
      (obj) => obj.objectType === 5
    );

    if (type5Objects.length === 0) {
      // Eğer type 5 obje yoksa ekranın ortasına yerleştir
      this.hand.position.set(window.innerWidth * 0.5, window.innerHeight * 0.5);
      return;
    }

    // İlk type 5 objesini kullan
    const targetObject = type5Objects[0];

    // 3D objenin dünya pozisyonunu al
    const worldPosition = new THREE.Vector3();
    targetObject.getWorldPosition(worldPosition);

    // Kamera referansını al
    const camera = globals.threeCamera;

    // 3D pozisyonu 2D screen space'e dönüştür
    const vector = worldPosition.clone();
    vector.project(camera);

    // Normalized device coordinates (-1 to 1) to screen coordinates
    const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;

    // Hand'i bu pozisyona yerleştir
    this.hand.position.set(
      x + data.handSpawnOffsetX,
      y + data.handSpawnOffsetY
    );
  }

  addPowerUpPanel() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    const bg = PIXI.Sprite.from(TextureCache['powerupBg']);
    cont.iWidth = bg.width;
    cont.iHeight = bg.height;
    bg.anchor.set(0.5);

    cont.addChild(bg);
    this.powerUpPanel = cont;

    const FourPowerupPosConfig = [-150, -50, 50, 150];
    const ThreePowerupPosConfig = [-100, 0, 100];
    const TwoPowerupPosConfig = [-50, 50];
    const OnePowerupPosConfig = [0];

    // Aktif powerup'ları belirle
    const powerupConfigs = [
      {
        name: 'powerupMagnet',
        type: 'magnet',
        isOpen: data.isPowerUpMagnetOpen,
        scale: data.powerupMagnetScale,
        counter: data.powerupMagnetCounter,
      },
      {
        name: 'powerupReverse',
        type: 'reverse',
        isOpen: data.isPowerUpReverseOpen,
        scale: data.powerupReverseScale,
        counter: data.powerupReverseCounter,
      },
      {
        name: 'powerupTornado',
        type: 'tornado',
        isOpen: data.isPowerUpTornadoOpen,
        scale: data.powerupTornadoScale,
        counter: data.powerupTornadoCounter,
      },
      {
        name: 'powerupTime',
        type: 'time',
        isOpen: data.isPowerUpTimeOpen,
        scale: data.powerupTimeScale,
        counter: data.powerupTimeCounter,
      },
    ];

    // True olan powerup'ları filtrele
    const activePowerups = powerupConfigs.filter((config) => config.isOpen);
    const powerupCount = activePowerups.length;

    // Sayıya göre pozisyon config'ini seç
    let positionConfig;
    switch (powerupCount) {
      case 1:
        positionConfig = OnePowerupPosConfig;
        break;
      case 2:
        positionConfig = TwoPowerupPosConfig;
        break;
      case 3:
        positionConfig = ThreePowerupPosConfig;
        break;
      case 4:
        positionConfig = FourPowerupPosConfig;
        break;
      default:
        positionConfig = [];
    }

    // Aktif powerup'ları dinamik olarak oluştur
    activePowerups.forEach((powerupConfig, index) => {
      const powerup = new Powerup(
        cont,
        powerupConfig.name,
        powerupConfig.type,
        powerupConfig.scale,
        powerupConfig.counter,
        positionConfig[index] || 0,
        0
      );

      if (powerupConfig.type === 'magnet') {
        this.magnetSprite = powerup.sprite;
      }
    });

    cont.resize = (w, h) => {
      globals.threesc;
      cont.scale.set(
        Math.min((w * 0.8) / cont.iWidth, (h * 0.1) / cont.iHeight)
      );

      if (w < h) {
        cont.position.set(w * 0.5, h * 0.94);
      } else {
        cont.position.set(w * 0.5, h * 0.94);
      }
    };
    cont.resize(window.innerWidth, window.innerHeight);
  }

  addRemainingObjPanel() {
    const cont = new PIXI.Container();
    pixiScene.addChild(cont);
    const bg = PIXI.Sprite.from(TextureCache['obj1Bg']);

    // Tüm obje konfigürasyonlarını tanımla
    const objConfigs = [
      {
        asset: 'obj1Bg',
        isOpen: data.isBarbieBoatRemainingOpen,
        count: data.barbieBoatCount,
      },
      {
        asset: 'obj2Bg',
        isOpen: data.isBarbieCarRemainingOpen,
        count: data.barbieCarCount,
      },
      {
        asset: 'obj3Bg',
        isOpen: data.isBarbieGirl1RemainingOpen,
        count: data.barbieGirl1Count,
      },
      {
        asset: 'obj4Bg',
        isOpen: data.isBarbieGirl2RemainingOpen,
        count: data.barbieGirl2Count,
      },
      {
        asset: 'obj5Bg',
        isOpen: data.isBarbieHouseRemainingOpen,
        count: data.barbieHouseCount,
      },
      {
        asset: 'obj6Bg',
        isOpen: data.isBarbieKenRemainingOpen,
        count: data.barbieKenCount,
      },
    ];

    // Sadece açık olanları filtrele
    const activeObjConfigs = objConfigs.filter((config) => config.isOpen);
    const activeObjCount = activeObjConfigs.length;

    // Container boyutlarını açık obje sayısına göre ayarla
    const singleObjWidth = 200; // Her obje için ayrılan genişlik
    cont.iWidth = singleObjWidth * activeObjCount;
    cont.iHeight = 140;

    console.log(
      'Toplam obje sayısı:',
      activeObjCount,
      'Container genişlik:',
      cont.iWidth
    );

    // Container width'i eşit bölümlere ayır
    const totalWidth = cont.iWidth;
    const sectionWidth = totalWidth / activeObjCount;
    const offsetX = 10; // Yatay offset (pozitif: sağa, negatif: sola)
    const offsetSpacing = 0; // Objeler arası ekstra boşluk

    // Sadece açık objeleri eşit aralıklarla yerleştir
    const remainingObjs = [];
    activeObjConfigs.forEach((config, index) => {
      // Her objeyi kendi bölümünün ortasına yerleştir + offset
      const basePosition =
        index * sectionWidth + sectionWidth / 2 - totalWidth / 2;
      const spacingOffset = index * offsetSpacing; // Her obje için artan boşluk
      const xPosition = basePosition + offsetX + spacingOffset;

      const remainingObj = new RemainingObj(
        cont,
        config.asset,
        1.85,
        xPosition,
        0,
        config.count
      );

      // RemainingObj'e obje tipini ekle (match kontrolü için)
      remainingObj.objectType = this.getObjectTypeFromAsset(config.asset);

      remainingObjs.push(remainingObj);
      this.remainingObjs.push(remainingObj); // Global referans
    });

    console.log(cont.iWidth, cont.iHeight);

    cont.resize = (w, h) => {
      if (w < h) {
        cont.position.set(w * 0.5, h * 0.15);
      } else {
        cont.position.set(w * 0.5, h * 0.15);
      }
      cont.scale.set(
        Math.min((w * 0.8) / cont.iWidth, (h * 0.05) / cont.iHeight)
      );
    };
    cont.resize(window.innerWidth, window.innerHeight);
  }

  addUpsidePanel() {
    const bg = PIXI.Sprite.from(TextureCache['headerBg']);
    pixiScene.addChild(bg);
    bg.anchor.set(0.5);
    bg.resize = (w, h) => {
      // Ekranın tam üstünde konumlandır
      bg.position.set(w * 0.5, bg.texture.height * bg.scale.y * 0.5);

      // X scale'ini ekran genişliği kadar yap
      bg.scale.x = w / bg.texture.width;

      // Y scale'ini ekran tipine göre adaptif yap
      const minScale =
        Math.min(w, h) / Math.max(bg.texture.width, bg.texture.height);
      const adaptiveScale = Math.min(
        minScale * 0.7,
        (h * 0.1) / bg.texture.height
      );
      bg.scale.y = adaptiveScale;

      // Pozisyonu scale'e göre yeniden ayarla
      bg.position.y = bg.texture.height * bg.scale.y * 0.5;
    };
    bg.resize(window.innerWidth, window.innerHeight);

    // Timer Container oluştur
    this.timerContainer = new PIXI.Container();
    pixiScene.addChild(this.timerContainer);

    // Timer arka plan bar
    const timerBarBg = PIXI.Sprite.from(TextureCache['timer_bar_bg']);
    this.timerContainer.iWidth = timerBarBg.width;
    this.timerContainer.iHeight = timerBarBg.height;
    timerBarBg.anchor.set(0.5);
    this.timerContainer.addChild(timerBarBg);

    // Timer dolum bar (yeşilden kırmızıya değişecek)
    this.timerFillBar = PIXI.Sprite.from(TextureCache['timer_fill_bar']);
    this.timerFillBar.anchor.set(0, 0.5); // Sol orta noktadan anchor
    this.timerFillBar.position.x = -timerBarBg.width * 0.5 + 5; // Sol kenardan başlat
    this.timerFillBar.position.y -= 2;
    this.timerContainer.addChild(this.timerFillBar);

    // Maskeleme için Graphics objesi oluştur
    this.timerMask = new PIXI.Graphics();
    this.timerMask.position.set(0, 0);
    this.timerContainer.addChild(this.timerMask);

    // Timer resize fonksiyonu
    this.timerContainer.resize = (w, h) => {
      this.timerContainer.position.set(w * 0.5, bg.position.y);
      this.timerContainer.scale.set(
        Math.min(
          (w * 0.45) / this.timerContainer.iWidth,
          (h * 0.05) / this.timerContainer.iHeight
        )
      );
    };
    this.timerContainer.resize(window.innerWidth, window.innerHeight);
    // Timer text'ini oluştur ve referansını sakla
    this.timerText = new PIXI.Text(this.formatTime(data.gameTime), {
      fontFamily: 'game-font',
      fontSize: 50,
      fill: 0xffffff,
      strokeThickness: 5,
      stroke: 0x000000,
      wordWrap: false,
      align: 'center',
    });
    timerBarBg.addChild(this.timerText);
    this.timerText.position.set(-timerBarBg.width * 0.7, -5);
    this.timerText.anchor.set(0.5);

    const timerPowerUpText = new PIXI.Text(data.timerPowerUpEffect, {
      fontFamily: 'game-font',
      fontSize: 20,
      fill: 0xffffff,
      strokeThickness: 5,
      stroke: 0x000000,
    });
    this.timerContainer.addChild(timerPowerUpText);
    timerPowerUpText.anchor.set(0.5);
    timerPowerUpText.alpha = 0;
    this.timerPowerUpText = timerPowerUpText;

    // İlk timer maskesini uygula
    this.updateTimerBar();

    // Timer'ı başlat
    this.startTimer();
  }

  timerPowerUpTextOpen() {
    // Powerup timer'ı başlat
    this.startPowerupCountdown();

    gsap.to(this.timerPowerUpText, {
      alpha: 1,
      duration: 0.5,
      ease: 'power1.inOut',
    });
  }

  // Yeni fonksiyon: Powerup countdown timer'ı
  startPowerupCountdown() {
    // Eğer önceki bir countdown varsa durdur
    if (this.powerupCountdownTween) {
      this.powerupCountdownTween.kill();
    }

    // Başlangıç değerini ayarla
    let currentCount = data.timerPowerUpEffect;
    this.timerPowerUpText.text = currentCount;

    // GSAP ile countdown animasyonu
    this.powerupCountdownTween = gsap.to(
      {},
      {
        duration: data.timerPowerUpEffect, // 5 saniye
        ease: 'none', // Linear
        onUpdate: () => {
          // Her saniyede bir güncelle
          const remaining = Math.ceil(
            data.timerPowerUpEffect -
              this.powerupCountdownTween.progress() * data.timerPowerUpEffect
          );
          if (remaining !== currentCount && remaining >= 0) {
            currentCount = remaining;
            this.timerPowerUpText.text = currentCount;
          }
        },
        onComplete: () => {
          // Countdown bittiğinde
          this.timerPowerUpText.text = 0;
          console.log('Powerup timer bitti!');
          // İsteğe bağlı: timer bittiğinde text'i gizle
          this.timerPowerUpTextClose();
        },
      }
    );
  }

  timerPowerUpTextClose() {
    // Countdown timer'ı durdur
    if (this.powerupCountdownTween) {
      this.powerupCountdownTween.kill();
      this.powerupCountdownTween = null;
    }

    gsap.to(this.timerPowerUpText, {
      alpha: 0,
      duration: 0.5,
      ease: 'power1.inOut',
    });
  }

  addHeaderText() {
    const style = new PIXI.TextStyle({
      fontFamily: 'game-font',
      fontSize: 85,
      fill: data.headerTextColor,
      strokeThickness: 0,
      wordWrap: false,
      align: 'center',
    });

    this.text = new PIXI.Text(data.headerText, style);
    pixiScene.addChild(this.text);

    this.text.iWidth = this.text.width;
    this.text.iHeight = this.text.height;
    this.text.anchor.set(0.5);

    this.text.resize = (w, h) => {
      this.text.x = w / 2;
      this.text.y = h * 0.3;
      this.text.scale.set(
        Math.min(w / this.text.iWidth, h / this.text.iHeight)
      );
    };
    this.text.resize(window.innerWidth, window.innerHeight);
  }

  addBackground() {
    let key = 'bg';
    let background;

    if (data.bgSrc) {
      background = PIXI.Sprite.from(TextureCache[key]);
    } else {
      background = new PIXI.Graphics();
      const drawBackground = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;

        background.clear();
        background.beginFill(data.flatBgColor);
        background.drawRect(0, 0, w, h);
        background.endFill();
      };

      drawBackground();
    }

    pixiScene.addChild(background);

    background.iWidth = background.width;
    background.iHeight = background.height;

    background.resize = (w, h) => {
      background.width = w;
      background.height = h;
    };
    background.resize(window.innerWidth, window.innerHeight);
  }

  // Timer bar'ını güncelleyen fonksiyon
  updateTimerBar() {
    // Progress değerini 0-1 arasında sınırla
    const clampedProgress = Math.max(0, Math.min(1, this.timerProgress));

    // Maskeyi temizle ve yeniden çiz
    this.timerMask.clear();
    this.timerMask.beginFill(0xffffff);

    // Maskeyi yatay olarak progress'e göre çiz (soldan sağa dolum)
    const barWidth = this.timerContainer.iWidth;
    const progressWidth = barWidth * clampedProgress;

    this.timerMask.drawRect(
      -barWidth / 2, // Sol kenar
      -this.timerContainer.iHeight * 0.5, // Üst kenar
      progressWidth, // Progress'e göre genişlik
      this.timerContainer.iHeight // Tam yükseklik
    );
    this.timerMask.endFill();

    // Maskeyi dolum bar'ına uygula
    this.timerFillBar.mask = this.timerMask;

    // Timer text'ini güncelle
    if (this.timerText) {
      const remainingTime = Math.ceil(this.timerProgress * this.timerDuration);
      this.timerText.text = this.formatTime(remainingTime);
    }
  }

  // Zamanı dakika:saniye formatına çeviren fonksiyon
  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Timer'ı başlatan fonksiyon
  startTimer() {
    // İlk progress değerini hemen göster
    this.updateTimerBar();
    this.isTimerRunning = true;

    // GSAP ile 60 saniyede progress'i 1'den 0'a indiren animasyon
    gsap.to(this, {
      timerProgress: 0,
      duration: this.timerDuration, // 60 saniye
      ease: 'none', // Linear animasyon
      delay: 0, // Gecikme yok
      onStart: () => {
        // Animasyon başladığında ilk güncellemeyi yap
        this.updateTimerBar();
        console.log('Timer başladı!');
      },
      onUpdate: () => {
        // Her frame'de timer bar'ını güncelle
        this.updateTimerBar();
      },
      onComplete: () => {
        // Timer bittiğinde
        console.log('Timer bitti!');
        this.onTimerComplete();
      },
    });
  }

  // Timer tamamlandığında çağrılan fonksiyon
  onTimerComplete() {
    // GameFinished event'ini fire et
    //globals.EventEmitter.emit('gameFinished');

    // Ek işlemler burada yapılabilir
    console.log('Oyun süresi bitti!');
  }

  // Timer'ı duraklatma fonksiyonu (isteğe bağlı)
  pauseTimer() {
    this.isTimerRunning = false;
    gsap.killTweensOf(this);
    this.originalTimerFillBarTint = this.timerFillBar.tint;

    // Önce beyaz yap
    this.timerFillBar.tint = 0xffffff;

    // Sonra koyu maviye geçiş yap
    gsap.to(this.timerFillBar, {
      pixi: { tint: 0x003366 },
      duration: 0.5,
      ease: 'power2.out',
    });
  }
  // Timer'ı devam ettirme fonksiyonu (isteğe bağlı)
  resumeTimer() {
    this.isTimerRunning = true;
    const remainingTime = this.timerProgress * this.timerDuration;
    this.timerFillBar.tint = this.originalTimerFillBarTint;
    gsap.to(this, {
      timerProgress: 0,
      duration: remainingTime,
      ease: 'none',
      onUpdate: () => {
        this.updateTimerBar();
      },
      onComplete: () => {
        this.onTimerComplete();
      },
    });
  }

  // Asset isminden veya sayıdan obje tipini çıkaran fonksiyon
  getObjectTypeFromAsset(asset) {
    const typeMap = {
      obj1Bg: 'barbieBoat',
      obj2Bg: 'barbieCar',
      obj3Bg: 'barbieGirl1',
      obj4Bg: 'barbieGirl2',
      obj5Bg: 'barbieHouse',
      obj6Bg: 'barbieKen',
      // ThreeGame'den gelen sayılar için mapping
      1: 'barbieBoat',
      2: 'barbieCar',
      3: 'barbieGirl1',
      4: 'barbieGirl2',
      5: 'barbieHouse',
      6: 'barbieKen',
    };
    return typeMap[asset] || asset;
  }

  // Match olduğunda remaining obj count'unu güncelleyen fonksiyon
  updateRemainingObjCount(objectType, matchedCount) {
    // ThreeGame'den gelen sayıyı obje tipine çevir
    const mappedObjectType = this.getObjectTypeFromAsset(objectType);

    // Debug: Mevcut tüm remainingObjs'leri listele
    console.log(
      '🔍 Mevcut remainingObjs:',
      this.remainingObjs.map((obj) => ({
        objectType: obj.objectType,
        count: obj.count,
      }))
    );

    // İlgili remainingObj'i bul ve count'unu güncelle (mapped type kullan)
    const remainingObj = this.remainingObjs.find(
      (obj) => obj.objectType === mappedObjectType
    );

    console.log(
      '🎯 Bulunan remainingObj:',
      remainingObj
        ? {
            objectType: remainingObj.objectType,
            count: remainingObj.count,
            hasUpdateCount: typeof remainingObj.updateCount === 'function',
          }
        : 'YOK'
    );

    if (remainingObj && remainingObj.updateCount) {
      console.log(
        `📝 ${mappedObjectType} için updateCount(-${matchedCount}) çağrılıyor...`
      );
      remainingObj.updateCount(-matchedCount); // Count'u azalt
      console.log(
        `✅ ${mappedObjectType} için remaining count güncellendi, yeni count: ${remainingObj.count}`
      );
    } else {
      console.log(
        `❌ ${mappedObjectType} için remainingObj bulunamadı veya updateCount metodu yok`
      );
    }
  }

  update(time, delta) {
    // Hand pozisyonunu sürekli güncelle (obje hareket ettiğinde takip etmesi için)
    if (this.hand && this.canHandPointer) {
      this.updateHandPosition();
    }
  }
}

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

    gsap.delayedCall(4, () => {
      this.canHandPointer = true;
      this.hand.visible = true;
    });
  }

  addHand() {
    this.hand = PIXI.Sprite.from(TextureCache['hand']);
    this.hand.scale.set(data.handScale);
    this.hand.anchor.set(0.5); // Merkezi anchor yap
    this.hand.visible = false;

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
    this.hand.position.set(x + 50, y + 25);
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

    // İlk timer maskesini uygula
    this.updateTimerBar();

    // Timer'ı başlat
    this.startTimer();
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

  addVideo() {
    // Create and position the video sprite
    const videoElement = globals.resources.video.data; // Directly get the video element from the resource
    videoElement.muted = true;
    if (getDevicePlatform() === 'ios') {
      videoElement.autoplay = true;
    }

    videoElement.setAttribute('playsinline', 'playsinline');

    const videoTexture = PIXI.Texture.from(videoElement);

    const videoSprite = new PIXI.Sprite(videoTexture);
    videoSprite.zIndex = 0;
    videoSprite.anchor.set(0.5);
    videoSprite.iWidth = videoElement.videoWidth;
    videoSprite.iHeight = videoElement.videoHeight;
    videoSprite.resize = (w, h) => {
      videoSprite.x = w / 2;
      videoSprite.y = h / 2;
      videoSprite.scale.set(
        Math.min(w / videoSprite.iWidth, h / videoSprite.iHeight)
      );
    };
    videoSprite.resize(window.innerWidth, window.innerHeight);

    pixiScene.addChild(videoSprite);
    gsap.delayedCall(1.45, () => {
      // console.log("pause video");
      videoElement.pause();
      this.showFaces();
    });

    this.video = videoSprite;
    this.video.controller = videoElement;
  }

  // Timer bar'ını güncelleyen fonksiyon
  updateTimerBar() {
    // Progress değerini 0-1 arasında sınırla
    const clampedProgress = Math.max(0, Math.min(1, this.timerProgress));

    // Maskeyi temizle ve yeniden çiz
    this.timerMask.clear();
    this.timerMask.beginFill(0xffffff);

    // Maskeyı yatay olarak progress'e göre çiz (soldan sağa dolum)
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
  }

  // Timer'ı devam ettirme fonksiyonu (isteğe bağlı)
  resumeTimer() {
    this.isTimerRunning = true;
    const remainingTime = this.timerProgress * this.timerDuration;
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

const data = window.gameData ?? {
  //CAMERA
  camFov: 50,
  camRadius: 34,
  camTheta: 0, // -3.14 3.14
  camPhi: 0.26, // -3.14 3.14
  camOffsetX: 0,
  camOffsetY: 0,
  camOffsetZ: 0.8,

  //hand
  handSrc: null,

  //AUDIO
  bgmSrc: null, // background music source
  bgmVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  collectSrc: null,
  collectVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  addTraySrc: null,
  addTrayVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  clickSrc: null,
  clickVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  matchSrc: null,
  matchVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  reverseSrc: null,
  reverseVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  magnetSrc: null,
  magnetVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  tornadoSrc: null,
  tornadoVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  timeSrc: null,
  timeVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  nextLevelSrc: null,
  nextLevelVolume: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01

  //GAME OPTIONS
  gameTime: 150,
  gameBgColor: 0xffa8e2, // Pembe renk
  isStartTransitionOpen: true,
  gameBoardTrayColor: 0xfc60c9,
  //START TRANSITION TEXT
  isHeaderTextOpen: true,
  headerText: 'Lets Collect All The Barbie Toys!',
  headerTextColor: 0x000000,
  headerTextScale: 0.75,
  headerTextPosYHorizontal: 0.5,
  headerTextPosXHorizontal: 0.5,
  headerTextPosYVertical: 0.5,
  headerTextPosXVertical: 0.5,
  headerTextFontSize: 30,
  headerTextFontColor: 0xffffff,
  headerTextFontStroke: 0x000000,
  headerTextFontStrokeThickness: 6,

  //NEXT LEVEL
  nextLevelText: 'NEXT LEVEL', // type "_" for new line
  nextLevelTextColor: '#ffffff',
  nextLevelTextStrokeThickness: 5, // default: 0, min: 0, max: 10, step: 1
  nextLevelTextStrokeColor: '#000000',
  nextLevelTextFontSize: 60, // default: 60, min: 10, max: 100, step: 1
  nextLevelBgAlpha: 0.5, // default: 0.5, min: 0, max: 1, step: 0.01
  nextLevelBgColor: '#00ff00', // default: '#00ff00'
  levelTransitionDuration: 1, // default: 1, min: 1, max: 3, step: 0.5
  level2BgColor: 0xe6b3f0,
  level2TrayColor: 0xd147a3,
  //HAND
  handScale: 0.3,
  handSrc: null,
  handSpawnOffsetX: 30,
  handSpawnOffsetY: 20,

  //MAP MODELS
  barbieBoatSrc: null,
  barbieBoatScale: 7,
  barbieBoatCount: 18, //max 18 min 3 step 3
  barbieCarSrc: null,
  barbieCarScale: 7,
  barbieCarCount: 18, //max 18 min 3 step 3
  barbieGirl1Src: null,
  barbieGirl1Scale: 7,
  barbieGirl1Count: 18, //max 18 min 3 step 3
  barbieGirl2Src: null,
  barbieGirl2Scale: 7,
  barbieGirl2Count: 18, //max 18 min 3 step 3
  barbieHouseSrc: null,
  barbieHouseScale: 7,
  barbieHouseCount: 6, //max 18 min 3 step 3
  barbieKenSrc: null,
  barbieKenScale: 7,
  barbieKenCount: 18, //max 18 min 3 step 3

  //REMAINING OBJ
  isBarbieBoatRemainingOpen: true,
  barbieBoatRemainingSrc: null,
  barbieBoatRemainingScale: 0.5,
  isBarbieCarRemainingOpen: true,
  barbieCarRemainingSrc: null,
  barbieCarRemainingScale: 0.5,
  isBarbieGirl1RemainingOpen: true,
  barbieGirl1RemainingSrc: null,
  barbieGirl1RemainingScale: 0.4,
  isBarbieGirl2RemainingOpen: true,
  barbieGirl2RemainingSrc: null,
  barbieGirl2RemainingScale: 0.4,
  isBarbieHouseRemainingOpen: true,
  barbieHouseRemainingSrc: null,
  barbieHouseRemainingScale: 0.5,
  isBarbieKenRemainingOpen: true,
  barbieKenRemainingSrc: null,
  barbieKenRemainingScale: 0.4,

  //POWERUP
  counterBgScale: 0.75,
  counterBgPosX: 20,
  counterBgPosY: 25,

  isPowerUpMagnetOpen: true,
  powerupMagnetSrc: null,
  powerupMagnetGraySrc: null,
  powerupMagnetGrayScale: 0.4,
  powerupMagnetScale: 0.4,
  powerupMagnetCounter: 100,

  isPowerUpReverseOpen: true,
  powerupReverseSrc: null,
  powerupReverseGraySrc: null,
  powerupReverseGrayScale: 0.4,
  powerupReverseScale: 0.4,
  powerupReverseCounter: 5,

  isPowerUpTimeOpen: true,
  powerupTimeSrc: null,
  powerupTimeGraySrc: null,
  powerupTimeGrayScale: 0.4,
  powerupTimeScale: 0.4,
  powerupTimeCounter: 2,
  timerPowerUpEffect: 5,

  isPowerUpTornadoOpen: true,
  powerupTornadoSrc: null,
  powerupTornadoGraySrc: null,
  powerupTornadoGrayScale: 0.4,
  powerupTornadoScale: 0.4,
  powerupTornadoCounter: 20,

  //SOTORE && MARKET PARAMETERS
  xSecondsToOpenEndcard: 0, //step 1 min 0 max 200
  xSecondsToOpenStore: 0, //step 1 min 0 max 200

  xClicksToOpenStore: 0, //step 1 min 0 max 200
  xClicksToOpenEndcard: 0, //step 1 min 0 max 200

  xMatchesToOpenStore: 0, //step 1 min 0 max 30
  xMatchesToOpenEndcard: 0, //step 1 min 0 max 30

  xObjCollectedToOpenStore: 0, //step 1 min 0 max 90
  xObjCollectedToOpenEndcard: 0, //step 1 min 0 max 90

  //ENDCARD
  isEndcardLogoOpen: true,
  endcardBackgroundColor: 0x000000,
  endcardBackgroundAlpha: 0.5,
  endcardLogoSrc: null,
  endcardLogoScaleHorizontal: 0.75,
  endcardLogoScaleVertical: 0.75,
  endcardLogoPosXHorizontal: 0.5,
  endcardLogoPosYHorizontal: 0.2,
  endcardLogoPosXVertical: 0.5,
  endcardLogoPosYVertical: 0.2,

  isEndcardHeaderTextOpen: true,
  endcardHeaderText: 'GAME OVER',
  endcardHeaderTextFontColor: 0xffffff,
  endcardHeaderTextFontStroke: 0x000000,
  endcardHeaderTextFontStrokeThickness: 6,
  endcardHeaderTextScale: 0.75,
  endcardHeaderTextPosYHorizontal: 0.5,
  endcardHeaderTextPosXHorizontal: 0.5,
  endcardHeaderTextPosYVertical: 0.5,
  endcardHeaderTextPosXVertical: 0.5,

  isEndcardButtonOpen: true,
  endcardButtonSrc: null,
  endcardButtonScale: 0.75,
  endcardButtonPosXHorizontal: 0.5,
  endcardButtonPosYHorizontal: 0.8,
  endcardButtonPosXVertical: 0.5,
  endcardButtonPosYVertical: 0.8,

  isMiddleImageOpen: true,
  isMiddleImageBackRayOpen: true,
  middleImageSrc: null,
  middleImagePosXHorizontal: 0.5,
  middleImagePosYHorizontal: 0.5,
  middleImagePosXVertical: 0.5,
  middleImagePosYVertical: 0.5,
  middleImageScaleHorizontal: 0.75,
  middleImageScaleVertical: 0.75,
};

export default data;

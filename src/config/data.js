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

  //HEADER
  headerText: 'placeholder text!',
  headerTextColor: 0x000000,

  //AUDIO
  bgmSrc: null, // background music source

  //GAME OPTIONS
  gameTime: 120,
  gameBgColor: 0x6b8cae, // Gri-mavi karışımı renk

  //HAND
  handScale: 0.3,
  handSrc: null,
  handSpawnOffsetX: 30,
  handSpawnOffsetY: 20,

  //MAP MODELS
  barbieBoatSrc: null,
  barbieBoatScale: 1,
  barbieBoatCount: 15, //max 15 min 3 step 3
  barbieCarSrc: null,
  barbieCarScale: 1,
  barbieCarCount: 15, //max 15 min 3 step 3
  barbieGirl1Src: null,
  barbieGirl1Scale: 1,
  barbieGirl1Count: 15, //max 15 min 3 step 3
  barbieGirl2Src: null,
  barbieGirl2Scale: 1,
  barbieGirl2Count: 15, //max 15 min 3 step 3
  barbieHouseSrc: null,
  barbieHouseScale: 1,
  barbieHouseCount: 15, //max 15 min 3 step 3
  barbieKenSrc: null,
  barbieKenScale: 1,
  barbieKenCount: 15, //max 15 min 3 step 3

  //REMAINING OBJ
  isBarbieBoatRemainingOpen: true,
  isBarbieCarRemainingOpen: true,
  isBarbieGirl1RemainingOpen: true,
  isBarbieGirl2RemainingOpen: true,
  isBarbieHouseRemainingOpen: true,
  isBarbieKenRemainingOpen: true,

  //POWERUP
  counterBgScale: 0.75,
  counterBgPosX: 20,
  counterBgPosY: 25,

  isPowerUpMagnetOpen: true,
  powerupMagnetSrc: null,
  powerupMagnetGraySrc: null,
  powerupMagnetGrayScale: 0.4,
  powerupMagnetScale: 0.4,
  powerupMagnetCounter: 2,

  isPowerUpReverseOpen: true,
  powerupReverseSrc: null,
  powerupReverseGraySrc: null,
  powerupReverseGrayScale: 0.4,
  powerupReverseScale: 0.4,
  powerupReverseCounter: 2,

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
  powerupTornadoCounter: 2,

  //SOTORE && MARKET PARAMETERS

  //ENDCARD
  xSecondsToOpenEndcard: 0, //step 1 min 0 max 200
  xSecondsToOpenStore: 0, //step 1 min 0 max 200

  xClicksToOpenStore: 0, //step 1 min 0 max 200
  xClicksToOpenEndcard: 0, //step 1 min 0 max 200

  xMatchesToOpenStore: 0, //step 1 min 0 max 30
  xMatchesToOpenEndcard: 0, //step 1 min 0 max 30

  xObjCollectedToOpenStore: 0, //step 1 min 0 max 90
  xObjCollectedToOpenEndcard: 0, //step 1 min 0 max 90

  //LOGO
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

  //HEADER TEXT
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

  //BUTTON
  isEndcardButtonOpen: true,
  endcardButtonSrc: null,
  endcardButtonScale: 0.75,
  endcardButtonPosXHorizontal: 0.5,
  endcardButtonPosYHorizontal: 0.8,
  endcardButtonPosXVertical: 0.5,
  endcardButtonPosYVertical: 0.8,
};

export default data;

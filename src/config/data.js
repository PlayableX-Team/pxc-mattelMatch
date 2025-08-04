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

  //BACKGROUND
  bgSrc: null,
  flatBgColor: 0x718c5f,

  //HEADER
  headerText: 'placeholder text!',
  headerTextColor: 0x000000,

  //AUDIO
  bgmSrc: null, // background music source

  //GAME OPTIONS
  gameTime: 120,

  //HAND
  handScale: 0.3,
  handSrc: null,
  handSpawnOffsetX: 30,
  handSpawnOffsetY: 20,

  //MAP MODELS
  barbieBoatSrc: null,
  barbieBoatScale: 1,
  barbieBoatCount: 18, //max 18 min 3 step 3
  barbieCarSrc: null,
  barbieCarScale: 1,
  barbieCarCount: 18, //max 18 min 3 step 3
  barbieGirl1Src: null,
  barbieGirl1Scale: 1,
  barbieGirl1Count: 18, //max 18 min 3 step 3
  barbieGirl2Src: null,
  barbieGirl2Scale: 1,
  barbieGirl2Count: 18, //max 18 min 3 step 3
  barbieHouseSrc: null,
  barbieHouseScale: 1,
  barbieHouseCount: 18, //max 18 min 3 step 3
  barbieKenSrc: null,
  barbieKenScale: 1,
  barbieKenCount: 18, //max 18 min 3 step 3

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
  powerupMagnetScale: 0.4,
  powerupMagnetCounter: 5,

  isPowerUpReverseOpen: true,
  powerupReverseSrc: null,
  powerupReverseScale: 0.4,
  powerupReverseCounter: 5,

  isPowerUpTimeOpen: true,
  powerupTimeSrc: null,
  powerupTimeScale: 0.4,
  powerupTimeCounter: 10,
  timerPowerUpEffect: 5,

  isPowerUpTornadoOpen: true,
  powerupTornadoSrc: null,
  powerupTornadoScale: 0.4,
  powerupTornadoCounter: 5,

  //ENDCARD
  //LOGO
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
  endcardButtonSrc: null,
  endcardButtonScale: 0.75,
  endcardButtonPosXHorizontal: 0.5,
  endcardButtonPosYHorizontal: 0.8,
  endcardButtonPosXVertical: 0.5,
  endcardButtonPosYVertical: 0.8,
};

export default data;

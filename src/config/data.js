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

  //MAP MODELS
  barbieBoatSrc: null,
  barbieBoatScale: 1,
  barbieBoatCount: 19,
  barbieCarSrc: null,
  barbieCarScale: 2,
  barbieCarCount: 18,
  barbieGirl1Src: null,
  barbieGirl1Scale: 1,
  barbieGirl1Count: 17,
  barbieGirl2Src: null,
  barbieGirl2Scale: 1,
  barbieGirl2Count: 16,
  barbieHouseSrc: null,
  barbieHouseScale: 1,
  barbieHouseCount: 15,
  barbieKenSrc: null,
  barbieKenScale: 1,
  barbieKenCount: 14,

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
};

export default data;

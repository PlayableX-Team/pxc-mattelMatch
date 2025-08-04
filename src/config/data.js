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
  handScale: 0.5,
  handSrc: null,

  //MAP MODELS
  barbieBoatSrc: null,
  barbieBoatScale: 1,
  barbieBoatCount: 19,
  barbieCarSrc: null,
  barbieCarScale: 1,
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
  isPowerUpMagnetOpen: true,
  powerupMagnetSrc: null,
  powerupMagnetScale: 0.4,

  isPowerUpReverseOpen: true,
  powerupReverseSrc: null,
  powerupReverseScale: 0.4,

  isPowerUpTimeOpen: true,
  powerupTimeSrc: null,
  powerupTimeScale: 0.4,

  isPowerUpTornadoOpen: true,
  powerupTornadoSrc: null,
  powerupTornadoScale: 0.4,
};

export default data;

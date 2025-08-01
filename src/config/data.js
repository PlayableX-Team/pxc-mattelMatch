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
  gameTime: 100,

  //MAP MODELS
  barbieBoatSrc: null,
  barbieBoatScale: 1.5,
  barbieBoatCount: 20,
  barbieCarSrc: null,
  barbieCarScale: 1.5,
  barbieCarCount: 20,
  barbieGirl1Src: null,
  barbieGirl1Scale: 1.5,
  barbieGirl1Count: 20,
  barbieGirl2Src: null,
  barbieGirl2Scale: 1.5,
  barbieGirl2Count: 20,
  barbieHouseSrc: null,
  barbieHouseScale: 1.5,
  barbieHouseCount: 20,
  barbieKenSrc: null,
  barbieKenScale: 1.5,
  barbieKenCount: 20,

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

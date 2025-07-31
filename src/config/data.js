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

  //POWERUP

  isPowerUpMagnetOpen: true,
  powerupMagnetSrc: null,

  isPowerUpReverseOpen: true,
  powerupReverseSrc: null,

  isPowerUpTimeOpen: true,
  powerupTimeSrc: null,

  isPowerUpTornadoOpen: true,
  powerupTornadoSrc: null,
};

export default data;

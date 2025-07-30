const data = window.gameData ?? {
  //CAMERA
  camFov: 105,
  camRadius: 15,
  camTheta: 0, // -3.14 3.14
  camPhi: 0.2, // -3.14 3.14
  camOffsetX: 0,
  camOffsetY: 0,
  camOffsetZ: 0.5,

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
};

export default data;

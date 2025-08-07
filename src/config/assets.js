const assets = {
  pixi: [
    // {
    //   name: "mainImg",
    //   src: require("@assets/2d/adidas/adidas.jpg"),
    //   type: "image",
    // },
    {
      name: 'powerupBg',
      src: require('@assets/2d/Powerup/powerupBg.png'),
      type: 'image',
    },
    {
      name: 'headerBg',
      src: require('@assets/2d/headerBg.png'),
      type: 'image',
    },
    {
      name: 'timer_bar_bg',
      src: require('@assets/2d/timer/timer_bar_bg.png'),
      type: 'image',
    },
    {
      name: 'timer_fill_bar',
      src: require('@assets/2d/timer/timer_fill_bar.png'),
      type: 'image',
    },
    {
      name: 'obj1Bg',
      src: require('@assets/2d/RemainingObj/obj1Bg.png'),
      type: 'image',
    },
    {
      name: 'obj2Bg',
      src: require('@assets/2d/RemainingObj/obj2Bg.png'),
      type: 'image',
    },
    {
      name: 'obj3Bg',
      src: require('@assets/2d/RemainingObj/obj3Bg.png'),
      type: 'image',
    },
    {
      name: 'obj4Bg',
      src: require('@assets/2d/RemainingObj/obj4Bg.png'),
      type: 'image',
    },
    {
      name: 'obj5Bg',
      src: require('@assets/2d/RemainingObj/obj5Bg.png'),
      type: 'image',
    },
    {
      name: 'obj6Bg',
      src: require('@assets/2d/RemainingObj/obj6Bg.png'),
      type: 'image',
    },
    {
      name: 'counterBg',
      src: require('@assets/2d/Powerup/counterBg.png'),
      type: 'image',
    },
    {
      name: 'blueBg',
      src: require('@assets/2d/blueBg.png'),
      type: 'image',
    },
    {
      name: 'Snow',
      src: require('@assets/2d/Snow.png'),
      type: 'image',
    },
    {
      name: 'backRay',
      src: require('@assets/2d/endcard/backRay.png'),
      type: 'image',
    },
    {
      name: 'cartoonSmoke',
      src: require('@assets/2d/cartoonSmoke.png'),
      type: 'image',
    },
    {
      name: 'spark',
      src: require('@assets/2d/spark.png'),
      type: 'image',
    },
  ],
  spine: [],
  three: [
    {
      name: 'tray',
      src: require('@assets/models/tray.glb'),
      type: 'glb',
    },
  ],
  three_textures: [],
  audio: {},
  quarks: [
    // {
    //   name: "Gold_Shower",
    //   src: require("@assets/quarks/Gold_Shower.json"),
    //   poolCount: 5,
    // },
  ],
  fonts: [
    {
      name: 'game-font',
      src: require('@assets/fonts/game-font.woff2'),
      type: 'font',
    },
  ],
};

export function insertAssets(data) {
  if (data.bgmSrc) {
    assets.audio.bgm = {
      src: data.bgmSrc,
      loop: true,
      volume: data.bgmVolume,
    };
  }
  if (data.collectSrc) {
    assets.audio.collect = {
      src: data.collectSrc,
      volume: data.collectVolume,
    };
  }
  if (data.addTraySrc) {
    assets.audio.addTray = {
      src: data.addTraySrc,
      volume: data.addTrayVolume,
    };
  }
  if (data.clickSrc) {
    assets.audio.click = {
      src: data.clickSrc,
      volume: data.clickVolume,
    };
  }
  if (data.matchSrc) {
    assets.audio.match = {
      src: data.matchSrc,
      volume: data.matchVolume,
    };
  }
  if (data.reverseSrc) {
    assets.audio.reverse = {
      src: data.reverseSrc,
      volume: data.reverseVolume,
    };
  }
  if (data.magnetSrc) {
    assets.audio.magnet = {
      src: data.magnetSrc,
      volume: data.magnetVolume,
    };
  }
  if (data.tornadoSrc) {
    assets.audio.tornado = {
      src: data.tornadoSrc,
      volume: data.tornadoVolume,
    };
  }
  if (data.timeSrc) {
    assets.audio.time = {
      src: data.timeSrc,
      volume: data.timeVolume,
    };
  }
  if (data.nextLevelSrc) {
    assets.audio.nextLevel = {
      src: data.nextLevelSrc,
      volume: data.nextLevelVolume,
    };
  }
  if (data.endcardButtonSrc) {
    assets.pixi.push({
      name: 'endcardButton',
      src: data.endcardButtonSrc,
      type: 'image',
    });
  }
  if (data.endcardLogoSrc) {
    assets.pixi.push({
      name: 'endcardLogo',
      src: data.endcardLogoSrc,
      type: 'image',
    });
  }
  if (data.handSrc) {
    assets.pixi.push({
      name: 'hand',
      src: data.handSrc,
      type: 'image',
    });
  }
  if (data.powerupMagnetGraySrc) {
    assets.pixi.push({
      name: 'powerupMagnetGray',
      src: data.powerupMagnetGraySrc,
      type: 'image',
    });
  }
  if (data.powerupReverseGraySrc) {
    assets.pixi.push({
      name: 'powerupReverseGray',
      src: data.powerupReverseGraySrc,
      type: 'image',
    });
  }
  if (data.powerupTimeGraySrc) {
    assets.pixi.push({
      name: 'powerupTimeGray',
      src: data.powerupTimeGraySrc,
      type: 'image',
    });
  }
  if (data.powerupTornadoGraySrc) {
    assets.pixi.push({
      name: 'powerupTornadoGray',
      src: data.powerupTornadoGraySrc,
      type: 'image',
    });
  }
  if (data.powerupMagnetSrc) {
    assets.pixi.push({
      name: 'powerupMagnet',
      src: data.powerupMagnetSrc,
      type: 'image',
    });
  }
  if (data.powerupReverseSrc) {
    assets.pixi.push({
      name: 'powerupReverse',
      src: data.powerupReverseSrc,
      type: 'image',
    });
  }
  if (data.powerupTimeSrc) {
    assets.pixi.push({
      name: 'powerupTime',
      src: data.powerupTimeSrc,
      type: 'image',
    });
  }
  if (data.powerupTornadoSrc) {
    assets.pixi.push({
      name: 'powerupTornado',
      src: data.powerupTornadoSrc,
      type: 'image',
    });
  }
  if (data.middleImageSrc) {
    assets.pixi.push({
      name: 'middleImage',
      src: data.middleImageSrc,
      type: 'image',
    });
  }
  if (data.barbieBoatSrc) {
    assets.three.push({
      name: 'barbieBoat',
      src: data.barbieBoatSrc,
      type: 'glb',
    });
  }
  if (data.barbieCarSrc) {
    assets.three.push({
      name: 'barbieCar',
      src: data.barbieCarSrc,
      type: 'glb',
    });
  }
  if (data.barbieGirl1Src) {
    assets.three.push({
      name: 'barbieGirl1',
      src: data.barbieGirl1Src,
      type: 'glb',
    });
  }
  if (data.barbieGirl2Src) {
    assets.three.push({
      name: 'barbieGirl2',
      src: data.barbieGirl2Src,
      type: 'glb',
    });
  }
  if (data.barbieHouseSrc) {
    assets.three.push({
      name: 'barbieHouse',
      src: data.barbieHouseSrc,
      type: 'glb',
    });
  }
  if (data.barbieKenSrc) {
    assets.three.push({
      name: 'barbieKen',
      src: data.barbieKenSrc,
      type: 'glb',
    });
  }
  if (data.barbieBoatRemainingSrc) {
    assets.pixi.push({
      name: 'barbieBoatRemaining',
      src: data.barbieBoatRemainingSrc,
      type: 'image',
    });
  }
  if (data.barbieCarRemainingSrc) {
    assets.pixi.push({
      name: 'barbieCarRemaining',
      src: data.barbieCarRemainingSrc,
      type: 'image',
    });
  }
  if (data.barbieGirl1RemainingSrc) {
    assets.pixi.push({
      name: 'barbieGirl1Remaining',
      src: data.barbieGirl1RemainingSrc,
      type: 'image',
    });
  }
  if (data.barbieGirl2RemainingSrc) {
    assets.pixi.push({
      name: 'barbieGirl2Remaining',
      src: data.barbieGirl2RemainingSrc,
      type: 'image',
    });
  }
  if (data.barbieHouseRemainingSrc) {
    assets.pixi.push({
      name: 'barbieHouseRemaining',
      src: data.barbieHouseRemainingSrc,
      type: 'image',
    });
  }
  if (data.barbieKenRemainingSrc) {
    assets.pixi.push({
      name: 'barbieKenRemaining',
      src: data.barbieKenRemainingSrc,
      type: 'image',
    });
  }
}

export default assets;

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
  ],
  spine: [],
  three: [
    {
      name: 'tyre-v1',
      src: require('@assets/models/junks/tyre-last.glb'),
      type: 'glb',
    },
    {
      name: 'junk_07-v1',
      src: require('@assets/models/junks/junk_07-v2.glb'),
      type: 'glb',
    },
    {
      name: 'junk_00-v1',
      src: require('@assets/models/junks/junk_00-v2.glb'),
      type: 'glb',
    },
    {
      name: 'junk_06-v1',
      src: require('@assets/models/junks/junk_06-v2.glb'),
      type: 'glb',
    },
    {
      name: 'junk_02-v1',
      src: require('@assets/models/junks/junk_02-v2.glb'),
      type: 'glb',
    },
    {
      name: 'junk_04-v1',
      src: require('@assets/models/junks/junk_04-v2.glb'),
      type: 'glb',
    },
    {
      name: 'tv-v1',
      src: require('@assets/models/junks/tv-v2.glb'),
      type: 'glb',
    },
    {
      name: 'junk_10-v1',
      src: require('@assets/models/junks/junk_10-v2.glb'),
      type: 'glb',
    },
    {
      name: 'junk_08-v1',
      src: require('@assets/models/junks/junk_08-v2.glb'),
      type: 'glb',
    },
    {
      name: 'barbie_boat-v1',
      src: require('@assets/models/items/barbie_boat-v1.glb'),
      type: 'glb',
    },
    {
      name: 'barbie_car-v1',
      src: require('@assets/models/items/barbie_car-v1.glb'),
      type: 'glb',
    },
    {
      name: 'barbie_girl1-v1',
      src: require('@assets/models/items/barbie_girl1-v1.glb'),
      type: 'glb',
    },
    {
      name: 'barbie_girl2-v1',
      src: require('@assets/models/items/barbie_girl2-v1.glb'),
      type: 'glb',
    },
    {
      name: 'barbie_house-v1',
      src: require('@assets/models/items/barbie_house-v1.glb'),
      type: 'glb',
    },
    {
      name: 'barbie_ken-v1',
      src: require('@assets/models/items/barbie_ken-v1.glb'),
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
      volume: 0.5,
    };
  }
  if (data.handSrc) {
    assets.pixi.push({
      name: 'hand',
      src: data.handSrc,
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
}

export default assets;

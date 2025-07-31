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
}

export default assets;

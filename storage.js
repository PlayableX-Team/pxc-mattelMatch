function collectStorage(data) {
  data.bgmSrc = storage.bgms.items.default.src;
  data.powerupMagnetSrc = storage.powerupMagnet.items.powerupMagnet.src;
  data.powerupReverseSrc = storage.powerupReverse.items.powerupReverse.src;
  data.powerupTimeSrc = storage.powerupTime.items.powerupTime.src;
  data.powerupTornadoSrc = storage.powerupTornado.items.powerupTornado.src;
  data.barbieBoatSrc = storage.barbieBoat.items.barbieBoat.src;
  data.barbieCarSrc = storage.barbieCar.items.barbieCar.src;
  data.barbieGirl1Src = storage.barbieGirl1.items.barbieGirl1.src;
  data.barbieGirl2Src = storage.barbieGirl2.items.barbieGirl2.src;
  data.barbieHouseSrc = storage.barbieHouse.items.barbieHouse.src;
  data.barbieKenSrc = storage.barbieKen.items.barbieKen.src;
}

const storage = {
  barbieBoat: {
    label: 'Barbie Boat',
    description: 'Uploaded Barbie Boat for the game.',
    aiDescription: 'a collection of Barbie Boat for branding',
    items: {
      barbieBoat: {
        label: 'Barbie Boat',
        description: 'The Barbie Boat for the game.',
        aiDescription: 'Barbie Boat used in game',
        src: require('./assets/models/items/barbie_boat-v1.glb'),
        type: 'glb',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  barbieCar: {
    label: 'Barbie Car',
    description: 'Uploaded Barbie Car for the game.',
    aiDescription: 'a collection of Barbie Car for branding',
    items: {
      barbieCar: {
        label: 'Barbie Car',
        description: 'The Barbie Car for the game.',
        aiDescription: 'Barbie Car used in game',
        src: require('./assets/models/items/barbie_car-v1.glb'),
        type: 'glb',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  barbieGirl1: {
    label: 'Barbie Girl 1',
    description: 'Uploaded Barbie Girl 1 for the game.',
    aiDescription: 'a collection of Barbie Girl 1 for branding',
    items: {
      barbieGirl1: {
        label: 'Barbie Girl 1',
        description: 'The Barbie Girl 1 for the game.',
        aiDescription: 'Barbie Girl 1 used in game',
        src: require('./assets/models/items/barbie_girl1-v1.glb'),
        type: 'glb',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  barbieGirl2: {
    label: 'Barbie Girl 2',
    description: 'Uploaded Barbie Girl 2 for the game.',
    aiDescription: 'a collection of Barbie Girl 2 for branding',
    items: {
      barbieGirl2: {
        label: 'Barbie Girl 2',
        description: 'The Barbie Girl 2 for the game.',
        aiDescription: 'Barbie Girl 2 used in game',
        src: require('./assets/models/items/barbie_girl2-v1.glb'),
        type: 'glb',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  barbieHouse: {
    label: 'Barbie House',
    description: 'Uploaded Barbie House for the game.',
    aiDescription: 'a collection of Barbie House for branding',
    items: {
      barbieHouse: {
        label: 'Barbie House',
        description: 'The Barbie House for the game.',
        aiDescription: 'Barbie House used in game',
        src: require('./assets/models/items/barbie_house-v1.glb'),
        type: 'glb',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  barbieKen: {
    label: 'Barbie Ken',
    description: 'Uploaded Barbie Ken for the game.',
    aiDescription: 'a collection of Barbie Ken for branding',
    items: {
      barbieKen: {
        label: 'Barbie Ken',
        description: 'The Barbie Ken for the game.',
        aiDescription: 'Barbie Ken used in game',
        src: require('./assets/models/items/barbie_ken-v1.glb'),
        type: 'glb',
        previewIcon: 'base64-preview-primary',
      },
    },
  },

  bgms: {
    label: 'Background Music',
    description: 'Uploaded Background Music for the game.',
    aiDescription: 'a collection of Background Music for branding',
    items: {
      default: {
        label: 'Default',
        description: 'The Background Music for the game.',
        aiDescription: 'Background Music used in game',
        src: require('./assets/audio/bgm.mp3'),
        type: 'audio',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  powerupMagnet: {
    label: 'Powerup Magnet',
    description: 'Uploaded Powerup Magnet for the game.',
    aiDescription: 'a collection of Powerup Magnet for branding',
    items: {
      powerupMagnet: {
        label: 'Powerup Magnet',
        description: 'The Powerup Magnet for the game.',
        aiDescription: 'Powerup Magnet used in game',
        src: require('./assets/2d/Powerup/powerupMagnet.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  powerupReverse: {
    label: 'Powerup Reverse',
    description: 'Uploaded Powerup Reverse for the game.',
    aiDescription: 'a collection of Powerup Reverse for branding',
    items: {
      powerupReverse: {
        label: 'Powerup Reverse',
        description: 'The Powerup Reverse for the game.',
        aiDescription: 'Powerup Reverse used in game',
        src: require('./assets/2d/Powerup/powerupReverse.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  powerupTime: {
    label: 'Powerup Time',
    description: 'Uploaded Powerup Time for the game.',
    aiDescription: 'a collection of Powerup Time for branding',
    items: {
      powerupTime: {
        label: 'Powerup Time',
        description: 'The Powerup Time for the game.',
        aiDescription: 'Powerup Time used in game',
        src: require('./assets/2d/Powerup/powerupTime.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
  powerupTornado: {
    label: 'Powerup Tornado',
    description: 'Uploaded Powerup Tornado for the game.',
    aiDescription: 'a collection of Powerup Tornado for branding',
    items: {
      powerupTornado: {
        label: 'Powerup Tornado',
        description: 'The Powerup Tornado for the game.',
        aiDescription: 'Powerup Tornado used in game',
        src: require('./assets/2d/Powerup/powerupTornado.png'),
        type: 'image',
        previewIcon: 'base64-preview-primary',
      },
    },
  },
};

module.exports = { collectStorage, storage };

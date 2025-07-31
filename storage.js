function collectStorage(data) {
  data.bgmSrc = storage.bgms.items.default.src;
  data.powerupMagnetSrc = storage.powerupMagnet.items.powerupMagnet.src;
  data.powerupReverseSrc = storage.powerupReverse.items.powerupReverse.src;
  data.powerupTimeSrc = storage.powerupTime.items.powerupTime.src;
  data.powerupTornadoSrc = storage.powerupTornado.items.powerupTornado.src;
}

const storage = {
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

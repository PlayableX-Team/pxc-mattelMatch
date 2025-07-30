function collectStorage(data) {
  data.bgmSrc = storage.bgms.items.default.src;
}

const storage = {
  bgms: {
    label: "Background Music",
    description: "Uploaded Background Music for the game.",
    aiDescription: "a collection of Background Music for branding",
    items: {
      default: {
        label: "Default",
        description: "The Background Music for the game.",
        aiDescription: "Background Music used in game",
        src: require("./assets/audio/bgm.mp3"),
        type: "audio",
        previewIcon: "base64-preview-primary",
      },
    },
  },
};

module.exports = { collectStorage, storage };

import { ThreeRenderer } from "./ThreeRenderer";
import { PixiRenderer } from "./PixiRenderer";
import AudioManager from "../audio/AudioManager";
import globals from "../../globals";

export class RenderManager {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    // Initialize Three.js renderer first (background layer)
    this.threeRenderer = new ThreeRenderer(width, height);

    // Initialize Pixi.js renderer (foreground layer)
    this.pixiRenderer = new PixiRenderer(width, height);

    // Create container div for both renderers
    this.container = document.createElement("div");
    this.container.style.position = "relative";
    this.container.style.width = "100%";
    this.container.style.height = "100%";

    // Add renderers to container
    this.threeRenderer && this.container.appendChild(this.threeRenderer.view);
    this.container.appendChild(this.pixiRenderer.view);

    this.pixiRenderer.container.once("pointerdown", () => {
      console.log("First Interaction");
      AudioManager.playBackgroundMusic();
    });
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.threeRenderer?.resize(width, height);
    this.pixiRenderer.resize(width, height);

    this.pixiRenderer.container.children.forEach((child) => {
      child.resize && child.resize(width, height);
    });
  }

  update(delta) {
    this.threeRenderer?.update(delta);
    this.pixiRenderer.update(delta);
  }

  get view() {
    return this.container;
  }

  get pixiApp() {
    return this.pixiRenderer.app;
  }

  get pixiScene() {
    return this.pixiRenderer.container;
  }

  get threeScene() {
    return this.threeRenderer?.scene;
  }
}

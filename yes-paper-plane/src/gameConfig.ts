import Phaser from "phaser";

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 480;
export const PHYSICS_GRAVITY_Y = 200; // tuned light gravity

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "app",
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#f4f2ea",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: PHYSICS_GRAVITY_Y },
      debug: false
    }
  }
};













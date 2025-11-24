import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../gameConfig";

export default class Menu extends Phaser.Scene {
  constructor(){ super("Menu"); }

  create() {
    const title = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 40, "YES Paper Plane", {
      fontFamily: "sans-serif", fontSize: "32px", color: "#222"
    }).setOrigin(0.5);

    const btn = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 20, "Enter the Draft (Press Space)", {
      fontFamily: "sans-serif", fontSize: "18px", color: "#333"
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => this.scene.start("Game"));
    this.input.once("pointerdown", () => this.scene.start("Game"));
  }
}













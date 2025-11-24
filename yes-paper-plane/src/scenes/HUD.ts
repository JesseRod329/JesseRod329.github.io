import Phaser from "phaser";

export default class HUD extends Phaser.Scene {
  scoreText!: Phaser.GameObjects.Text;
  bestText!: Phaser.GameObjects.Text;
  score = 0;
  best = Number(localStorage.getItem("yes_best") ?? "0");

  constructor(){ super({ key: "HUD", active: false }); }

  create() {
    this.scoreText = this.add.text(16, 12, "Score: 0", { fontSize: "18px", color: "#111" });
    this.bestText = this.add.text(16, 36, `Best: ${this.best}`, { fontSize: "16px", color: "#444" });

    this.game.events.on("score:add", (n: number)=> this.addScore(n));
    this.game.events.on("score:reset", ()=> this.resetScore());
  }

  addScore(n: number) {
    this.score += n;
    this.scoreText.setText(`Score: ${this.score}`);
    if (this.score > this.best) {
      this.best = this.score;
      this.bestText.setText(`Best: ${this.best}`);
      localStorage.setItem("yes_best", String(this.best));
    }
  }

  resetScore() {
    this.score = 0;
    this.scoreText.setText("Score: 0");
  }
}













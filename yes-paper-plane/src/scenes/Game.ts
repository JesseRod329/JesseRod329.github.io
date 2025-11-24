import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, PHYSICS_GRAVITY_Y } from "../gameConfig";
import { difficultyAt } from "@systems/difficulty";
import { Pool } from "@systems/objectPool";

export default class Game extends Phaser.Scene {
  plane!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  bg!: Phaser.GameObjects.TileSprite;
  margin!: Phaser.GameObjects.TileSprite;

  obstacles!: Pool<Phaser.Types.Physics.Arcade.ImageWithDynamicBody>;
  coins!: Pool<Phaser.Types.Physics.Arcade.ImageWithDynamicBody>;

  elapsed = 0;
  nextSpawn = 0;
  audioContext!: AudioContext;
  gameOverFlag = false;

  constructor(){ super("Game"); }

  create() {
    this.gameOverFlag = false;
    this.elapsed = 0;
    this.nextSpawn = 0;
    this.scene.launch("HUD");
    this.game.events.emit("score:reset");

    // Parallax notebook (tile sprites)
    this.bg = this.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, "paperLine")
      .setOrigin(0).setScrollFactor(0);
    this.margin = this.add.tileSprite(40, 0, 2, GAME_HEIGHT, "margin").setOrigin(0).setScrollFactor(0);

    // Player (paper plane)
    this.plane = this.physics.add.sprite(120, GAME_HEIGHT/2, "plane");
    this.plane.setCollideWorldBounds(true).setDrag(50, 0);
    this.plane.setScale(1.2);

    // Input
    this.cursors = this.input.keyboard.createCursorKeys();

    // Pools
    this.obstacles = new Pool(() => {
      const o = this.physics.add.image(GAME_WIDTH + 60, 0, "obstacle");
      o.setImmovable(true);
      o.setVelocityX(-200);
      o.setActive(false).setVisible(false);
      return o;
    });

    this.coins = new Pool(() => {
      const c = this.physics.add.image(GAME_WIDTH + 60, 0, "coin");
      c.setCircle(8, 0, 0);
      c.setVelocityX(-200);
      c.setActive(false).setVisible(false);
      return c;
    });

    // Collisions will be handled manually in update() for object pools

    // Audio context for SFX
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  applyLift() {
    // Paper plane lift: upward impulse + slight forward boost
    this.plane.setVelocityY(-220);
    this.plane.setVelocityX(Math.max(0, this.plane.body.velocity.x + 30));
    this.playBeep(400, 0.1);
  }

  playBeep(freq: number, duration: number) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + duration);
  }

  spawnObstacle(speed: number) {
    const o = this.obstacles.get();
    const h = Phaser.Math.Between(80, 200);
    const top = Phaser.Math.Between(80, GAME_HEIGHT - h - 80);
    o.setPosition(GAME_WIDTH + 40, top).setDisplaySize(40, h);
    o.setVelocityX(-speed);
  }

  spawnCoinRow(speed: number) {
    const y = Phaser.Math.Between(80, GAME_HEIGHT - 80);
    const count = Phaser.Math.Between(3, 6);
    for (let i = 0; i < count; i++) {
      const c = this.coins.get();
      c.setPosition(GAME_WIDTH + 40 + i * 28, y + Math.sin(i) * 6);
      c.setVelocityX(-speed);
      c.setScale(1);
      
      // Add subtle glow animation to active coins
      this.tweens.add({
        targets: c,
        scaleX: 1.15,
        scaleY: 1.15,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut"
      });
    }
  }

  collectCoin(coin: Phaser.Types.Physics.Arcade.ImageWithDynamicBody) {
    // Stop any active tweens on the coin
    this.tweens.killTweensOf(coin);
    
    // Particle effect for coin collection
    const particles = this.add.particles(coin.x, coin.y, "coin", {
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      lifespan: 300,
      quantity: 8,
      tint: 0xffd700
    });
    
    this.time.delayedCall(300, () => particles.destroy());
    
    // Score popup text
    const scoreText = this.add.text(coin.x, coin.y - 20, "+1", {
      fontSize: "24px",
      color: "#ffd700",
      fontStyle: "bold",
      stroke: "#000",
      strokeThickness: 2
    }).setOrigin(0.5);
    
    this.tweens.add({
      targets: scoreText,
      y: coin.y - 50,
      alpha: 0,
      duration: 500,
      onComplete: () => scoreText.destroy()
    });
    
    this.coins.release(coin);
    this.game.events.emit("score:add", 1);
    this.cameras.main.shake(60, 0.001);
    this.playBeep(600, 0.15);
  }

  gameOver() {
    if (this.gameOverFlag) return;
    this.gameOverFlag = true;
    this.playBeep(200, 0.3);
    this.scene.stop("HUD");
    this.time.delayedCall(300, () => this.scene.start("Menu"));
  }

  update(_t: number, dtMs: number) {
    const dt = dtMs / 1000;
    this.elapsed += dt;
    const d = difficultyAt(this.elapsed);

    // Player controls: space or up arrow for lift
    if (this.cursors.up.isDown || Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.applyLift();
    }

    // Parallax scrolling
    this.bg.tilePositionX += d.speed * dt * 0.3;

    // Spawn obstacles and coins based on difficulty
    this.nextSpawn -= dtMs;
    if (this.nextSpawn <= 0) {
      if (Math.random() < 0.6) {
        this.spawnObstacle(d.speed);
      } else {
        this.spawnCoinRow(d.speed);
      }
      this.nextSpawn = d.spawnMs;
    }

    // Manual collision detection with object pools
    if (!this.gameOverFlag) {
      const planeBounds = this.plane.getBounds();

      // Coin collection
      this.coins.eachActive((obj) => {
        const c = obj as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
        const coinBounds = c.getBounds();
        if (Phaser.Geom.Rectangle.Overlaps(planeBounds, coinBounds)) {
          this.collectCoin(c);
        }
      });

      // Obstacle collision
      this.obstacles.eachActive((obj) => {
        const o = obj as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
        const obstBounds = o.getBounds();
        if (Phaser.Geom.Rectangle.Overlaps(planeBounds, obstBounds)) {
          this.gameOver();
        }
      });
    }

    // Cleanup off-screen objects
    this.obstacles.eachActive((obj) => {
      const o = obj as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      if (o.x + o.width < -50) {
        this.obstacles.release(o);
      }
    });

    this.coins.eachActive((obj) => {
      const c = obj as Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
      if (c.x + c.width < -50) {
        this.tweens.killTweensOf(c);
        this.coins.release(c);
      }
    });

    // Slight rotation based on velocity for paper plane feel
    this.plane.rotation = Phaser.Math.Clamp(this.plane.body.velocity.y * 0.001, -0.3, 0.3);
  }
}


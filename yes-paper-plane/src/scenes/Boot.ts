import Phaser from "phaser";

export default class Boot extends Phaser.Scene {
  constructor() { super("Boot"); }
  preload() {
    // Create award-winning pencil-drawn style assets
    this.createPaperPlane();
    this.createCoin();
    this.createObstacle();
    this.createNotebookPaper();
    this.createMargin();
  }

  createPaperPlane() {
    const g = this.add.graphics();
    const w = 80;
    const h = 30;
    
    // Hand-drawn paper plane with pencil texture
    g.fillStyle(0xf8f9fa, 0.9);
    g.lineStyle(2.5, 0x2c3e50, 1);
    
    // Main body (triangle)
    g.fillTriangle(w * 0.5, 0, w * 0.85, h * 0.6, w * 0.15, h * 0.6);
    g.strokeTriangle(w * 0.5, 0, w * 0.85, h * 0.6, w * 0.15, h * 0.6);
    
    // Wings with curves (using lineBetween for curves)
    g.lineStyle(2, 0x34495e, 0.8);
    // Top wing curve (approximated with line)
    g.lineBetween(w * 0.3, h * 0.4, w * 0.7, h * 0.5);
    // Bottom wing curve
    g.lineBetween(w * 0.3, h * 0.55, w * 0.7, h * 0.55);
    
    // Fold lines detail
    g.lineStyle(1.5, 0x7f8c8d, 0.6);
    g.lineBetween(w * 0.5, 0, w * 0.5, h * 0.6);
    
    // Shading for depth
    g.fillStyle(0xe8e8e8, 0.5);
    g.fillRect(w * 0.15, h * 0.6, w * 0.35, h * 0.4);
    
    g.generateTexture("plane", w, h);
    g.clear();
  }

  createCoin() {
    const g = this.add.graphics();
    const size = 24;
    
    // Hand-drawn coin with dollar sign
    g.fillStyle(0xffd700, 1);
    g.lineStyle(2.5, 0xdaa520, 1);
    g.fillCircle(size, size, size - 2);
    g.strokeCircle(size, size, size - 2);
    
    // Inner circle for coin detail
    g.lineStyle(1.5, 0xb8860b, 0.7);
    g.strokeCircle(size, size, size - 5);
    
    // Dollar sign - hand-drawn style
    g.lineStyle(2.5, 0x8b6914, 1);
    // Vertical line
    g.lineBetween(size, size - 8, size, size + 8);
    // Top curve (approximated with lines)
    g.lineBetween(size - 4, size - 6, size, size - 4);
    g.lineBetween(size, size - 4, size + 4, size - 6);
    // Bottom curve
    g.lineBetween(size - 4, size + 6, size, size + 4);
    g.lineBetween(size, size + 4, size + 4, size + 6);
    
    // Highlight
    g.fillStyle(0xffffff, 0.4);
    g.fillCircle(size - 3, size - 3, 4);
    
    g.generateTexture("coin", size * 2, size * 2);
    g.clear();
  }

  createObstacle() {
    const g = this.add.graphics();
    const w = 50;
    const h = 140;
    
    // Pencil eraser mark / smudge obstacle - simplified irregular shape
    g.fillStyle(0x95a5a6, 0.85);
    g.lineStyle(2, 0x7f8c8d, 1);
    
    // Create irregular shape using polygon
    const points = [
      w * 0.2, 0,
      w * 0.15, h * 0.2,
      w * 0.1, h * 0.6,
      w * 0.2, h * 0.95,
      w * 0.8, h * 0.95,
      w * 0.9, h * 0.6,
      w * 0.85, h * 0.2,
      w * 0.8, 0
    ];
    g.fillPoints(points, true);
    g.strokePoints(points, true);
    
    // Eraser texture - smudged lines
    g.lineStyle(1.5, 0x7f8c8d, 0.5);
    for (let i = 0; i < 8; i++) {
      const y = (h / 8) * i;
      g.lineBetween(
        w * 0.25 + Math.sin(i) * 2, 
        y, 
        w * 0.75 + Math.sin(i * 1.5) * 2, 
        y + 5
      );
    }
    
    // Darker edge for depth
    g.lineStyle(2.5, 0x5d6d7e, 1);
    g.strokeRect(w * 0.15, h * 0.05, w * 0.7, h * 0.9);
    
    g.generateTexture("obstacle", w, h);
    g.clear();
  }

  createNotebookPaper() {
    const g = this.add.graphics();
    const w = 16;
    const h = 16;
    
    // Notebook paper with blue lines
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, w, h);
    
    // Horizontal ruled lines (blue, like notebook paper)
    g.lineStyle(1, 0xadd8e6, 0.6);
    g.lineBetween(0, h / 2, w, h / 2);
    
    // Optional: subtle texture
    g.fillStyle(0xf5f5f5, 0.3);
    for (let i = 0; i < 3; i++) {
      g.fillRect(i * 5, 0, 1, h);
    }
    
    g.generateTexture("paperLine", w, h);
    g.clear();
  }

  createMargin() {
    const g = this.add.graphics();
    const w = 3;
    const h = 16;
    
    // Red margin line (like notebook)
    g.fillStyle(0xe74c3c, 0.9);
    g.fillRect(0, 0, w, h);
    
    // Slight gradient effect
    g.fillStyle(0xc0392b, 0.5);
    g.fillRect(0, 0, 1, h);
    
    g.generateTexture("margin", w, h);
    g.clear();
  }

  create() { 
    this.scene.start("Menu"); 
  }
}

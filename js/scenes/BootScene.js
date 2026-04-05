// ============================================================
//  BootScene — Generate all textures programmatically
// ============================================================

class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    this._makeNugget();
    this._makeVeggies();
    this._makeCondimentEnemies();
    this._makePowerUps();
    this._makeProjectile();
    this._makePlatform();
    this._makeGround();
    this._makeFlag();
    this._makeHeart();
    this._makeStarParticle();
    this._makeHamburger();
    this.scene.start('MenuScene');
  }

  // ── Helpers ────────────────────────────────────────────────

  _makeNugget() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Body — golden nugget shape
    g.fillStyle(0xD4820A, 1);
    g.fillRoundedRect(0, 0, 48, 38, 12);
    // Crispy coating bumps
    g.fillStyle(0xC46A00, 1);
    g.fillCircle(12, 8, 7);
    g.fillCircle(28, 5, 6);
    g.fillCircle(40, 10, 7);
    g.fillCircle(8, 22, 6);
    g.fillCircle(36, 25, 7);
    // Eyes
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(16, 16, 5);
    g.fillCircle(32, 16, 5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(18, 14, 2);
    g.fillCircle(34, 14, 2);
    // Smile
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(16, 24, 16, 3);
    g.fillRect(14, 22, 3, 3);
    g.fillRect(31, 22, 3, 3);
    g.generateTexture('nugget', 48, 38);
    g.destroy();
  }

  _makeVeggies() {
    this._drawCarrot();
    this._drawBroccoli();
    this._drawCelery();
    this._drawSpinach();
    this._drawCabbage();
    this._drawCauliflower();
  }

  _drawCarrot() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Leafy green top
    g.fillStyle(0x228B22, 1);
    g.fillRect(17, 0, 5, 16);
    g.fillRect(10, 2, 4, 13);
    g.fillRect(25, 2, 4, 13);
    g.fillStyle(0x44cc33, 1);
    g.fillEllipse(19, 6, 7, 14);
    g.fillEllipse(12, 8, 5, 11);
    g.fillEllipse(27, 8, 5, 11);
    // Orange body — wide rounded top, tapering to a point (NOT a pizza triangle)
    g.fillStyle(0xFF6600, 1);
    g.fillRoundedRect(7, 13, 25, 30, { tl: 10, tr: 10, bl: 0, br: 0 });
    // Taper to tip
    g.fillTriangle(7, 37, 32, 37, 19, 52);
    // Lighter highlight stripe down the left
    g.fillStyle(0xFF9933, 0.7);
    g.fillRoundedRect(9, 15, 8, 22, 4);
    // Eyes
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(14, 24, 4);
    g.fillCircle(25, 24, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(15, 23, 1.5);
    g.fillCircle(26, 23, 1.5);
    // Angry brows
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(10, 18, 8, 2.5);
    g.fillRect(22, 18, 8, 2.5);
    // Grumpy mouth
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(13, 32, 13, 3);
    g.fillRect(13, 30, 3, 3);
    g.fillRect(23, 30, 3, 3);
    g.generateTexture('carrot', 40, 54);
    g.destroy();
  }

  _drawBroccoli() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Stem
    g.fillStyle(0x55aa22, 1);
    g.fillRect(16, 32, 12, 18);
    // Head clusters
    g.fillStyle(0x228B22, 1);
    g.fillCircle(22, 22, 16);
    g.fillStyle(0x2ecc40, 1);
    g.fillCircle(12, 18, 11);
    g.fillCircle(32, 18, 11);
    g.fillCircle(22, 12, 11);
    // Eyes
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(16, 22, 4);
    g.fillCircle(28, 22, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(17, 21, 1.5);
    g.fillCircle(29, 21, 1.5);
    // Angry brow
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(12, 16, 8, 3);
    g.fillRect(24, 16, 8, 3);
    // Mouth
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(15, 28, 14, 3);
    g.generateTexture('broccoli', 44, 50);
    g.destroy();
  }

  _drawCelery() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Stalks
    g.fillStyle(0x7fc97f, 1);
    g.fillRect(6, 6, 10, 46);
    g.fillStyle(0x55aa55, 1);
    g.fillRect(19, 6, 10, 46);
    g.fillStyle(0x7fc97f, 1);
    g.fillRect(32, 6, 10, 46);
    // Leafy tops
    g.fillStyle(0x33bb33, 1);
    g.fillCircle(11, 6, 8);
    g.fillCircle(24, 4, 8);
    g.fillCircle(37, 6, 8);
    // Face on middle stalk
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(20, 26, 4);
    g.fillCircle(30, 26, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(21, 25, 1.5);
    g.fillCircle(31, 25, 1.5);
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(18, 34, 14, 3);
    g.generateTexture('celery', 48, 52);
    g.destroy();
  }

  _drawSpinach() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Leafy blob
    g.fillStyle(0x2d6a2d, 1);
    g.fillEllipse(22, 22, 42, 38);
    g.fillStyle(0x3d8b3d, 1);
    g.fillEllipse(14, 16, 22, 18);
    g.fillEllipse(30, 14, 20, 16);
    g.fillEllipse(10, 28, 18, 14);
    g.fillEllipse(32, 28, 18, 14);
    // Veins
    g.lineStyle(1.5, 0x1a4a1a, 1);
    g.strokeEllipse(22, 22, 38, 34);
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(15, 22, 5);
    g.fillCircle(29, 22, 5);
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(16, 23, 3);
    g.fillCircle(30, 23, 3);
    // Angry expression
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(12, 17, 7, 2.5);
    g.fillRect(25, 17, 7, 2.5);
    g.fillRect(14, 30, 16, 3);
    g.fillRect(14, 30, 3, -4);
    g.fillRect(27, 30, 3, -4);
    g.generateTexture('spinach', 44, 44);
    g.destroy();
  }

  _drawCabbage() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Outer leaves — pale green
    g.fillStyle(0x7dc47d, 1);
    g.fillEllipse(24, 26, 46, 42);
    // Mid leaves
    g.fillStyle(0x5aaa5a, 1);
    g.fillEllipse(24, 26, 36, 34);
    g.fillEllipse(12, 20, 20, 18);
    g.fillEllipse(36, 20, 20, 18);
    g.fillEllipse(24, 14, 22, 16);
    // Inner tight head
    g.fillStyle(0xaaddaa, 1);
    g.fillEllipse(24, 27, 24, 22);
    // Leaf vein lines
    g.lineStyle(1.5, 0x33883a, 0.6);
    g.strokeEllipse(24, 26, 42, 38);
    g.strokeEllipse(24, 26, 28, 26);
    // Eyes (mean)
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(17, 25, 4);
    g.fillCircle(31, 25, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(18, 24, 1.5);
    g.fillCircle(32, 24, 1.5);
    // Angry brows
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(13, 19, 8, 2.5);
    g.fillRect(27, 19, 8, 2.5);
    // Frown
    g.fillRect(15, 32, 18, 3);
    g.fillRect(15, 30, 3, 3);
    g.fillRect(30, 30, 3, 3);
    g.generateTexture('cabbage', 48, 48);
    g.destroy();
  }

  _drawCauliflower() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Green leaves base
    g.fillStyle(0x44aa33, 1);
    g.fillEllipse(24, 38, 50, 22);
    g.fillEllipse(10, 30, 22, 18);
    g.fillEllipse(38, 30, 22, 18);
    // Creamy white curd head
    g.fillStyle(0xF5F0DC, 1);
    g.fillEllipse(24, 22, 44, 36);
    // Curd bumps — overlapping circles for the floret texture
    g.fillStyle(0xFFFAF0, 1);
    g.fillCircle(13, 20, 8);
    g.fillCircle(24, 14, 9);
    g.fillCircle(35, 20, 8);
    g.fillCircle(18, 26, 7);
    g.fillCircle(30, 26, 7);
    // Shading between bumps
    g.fillStyle(0xDDD8C0, 0.5);
    g.fillCircle(18, 22, 5);
    g.fillCircle(29, 22, 5);
    g.fillCircle(24, 28, 4);
    // Eyes
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(17, 21, 4);
    g.fillCircle(31, 21, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(18, 20, 1.5);
    g.fillCircle(32, 20, 1.5);
    // Angry brows
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(13, 15, 8, 2.5);
    g.fillRect(27, 15, 8, 2.5);
    // Frown
    g.fillRect(16, 28, 16, 3);
    g.fillRect(16, 26, 3, 3);
    g.fillRect(29, 26, 3, 3);
    // Small wings to hint it can fly
    g.fillStyle(0xcceecc, 0.8);
    g.fillEllipse(4,  20, 14, 8);
    g.fillEllipse(44, 20, 14, 8);
    g.generateTexture('cauliflower', 48, 48);
    g.destroy();
  }

  _makeHamburger() {
    // Burger buddy companion sprite
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Bottom bun
    g.fillStyle(0xD4820A, 1);
    g.fillRoundedRect(4, 38, 44, 16, { tl: 4, tr: 4, bl: 10, br: 10 });
    g.fillStyle(0xF0A040, 0.5);
    g.fillRect(4, 38, 44, 4);
    // Patty
    g.fillStyle(0x7B3B00, 1);
    g.fillRoundedRect(3, 30, 46, 10, 3);
    // Cheese (yellow drip)
    g.fillStyle(0xFFCC00, 1);
    g.fillRect(2, 28, 48, 6);
    g.fillRect(0, 28, 6, 10);
    g.fillRect(46, 28, 6, 10);
    // Lettuce (green ruffles)
    g.fillStyle(0x44bb44, 1);
    g.fillEllipse(8,  25, 14, 8);
    g.fillEllipse(20, 23, 14, 8);
    g.fillEllipse(32, 25, 14, 8);
    g.fillEllipse(44, 25, 14, 8);
    // Top bun
    g.fillStyle(0xD4820A, 1);
    g.fillEllipse(26, 16, 46, 28);
    g.fillStyle(0xF5A050, 1);
    g.fillEllipse(26, 14, 36, 16);
    // Sesame seeds
    g.fillStyle(0xFFEECC, 1);
    g.fillEllipse(16, 10, 5, 3);
    g.fillEllipse(28, 7,  5, 3);
    g.fillEllipse(38, 11, 5, 3);
    // Friendly eyes
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(18, 18, 5);
    g.fillCircle(34, 18, 5);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(19, 17, 2);
    g.fillCircle(35, 17, 2);
    // Big smile
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(16, 24, 20, 3);
    g.fillRect(14, 21, 3, 5);
    g.fillRect(35, 21, 3, 5);
    g.generateTexture('burger_buddy', 52, 54);
    g.destroy();

    // Burger power-up collectible (smaller, glowing)
    const gp = this.make.graphics({ x: 0, y: 0, add: false });
    gp.fillStyle(0xFFAA00, 0.3);
    gp.fillCircle(20, 20, 20);
    gp.fillStyle(0xD4820A, 1);
    gp.fillEllipse(20, 22, 34, 20);
    gp.fillStyle(0x7B3B00, 1);
    gp.fillRect(5, 19, 30, 6);
    gp.fillStyle(0x44bb44, 1);
    gp.fillEllipse(20, 17, 28, 8);
    gp.fillStyle(0xD4820A, 1);
    gp.fillEllipse(20, 13, 32, 16);
    gp.fillStyle(0xffffff, 1);
    gp.fillCircle(14, 12, 3);
    gp.fillCircle(22, 10, 3);
    gp.fillCircle(29, 12, 3);
    gp.generateTexture('burger_pu', 40, 36);
    gp.destroy();
  }

  _makeCondimentEnemies() {
    // Ketchup bottle
    this._drawBottle('ketchup_e', 0xCC1111, 0xFF4444, 0x880000);
    // Mustard bottle
    this._drawBottle('mustard_e', 0xCCBB00, 0xFFEE22, 0x887700);
    // Salad Dressing bottle
    this._drawBottle('dressing_e', 0xEEDDCC, 0xFFF8F0, 0x998877);
  }

  _drawBottle(key, mainColor, lightColor, darkColor) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Cap
    g.fillStyle(darkColor, 1);
    g.fillRect(12, 0, 16, 8);
    g.fillRoundedRect(10, 4, 20, 8, 4);
    // Neck
    g.fillStyle(lightColor, 1);
    g.fillRect(14, 10, 12, 8);
    // Body
    g.fillStyle(mainColor, 1);
    g.fillRoundedRect(4, 16, 32, 36, 8);
    // Label
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(8, 22, 24, 20, 4);
    // Eyes (angry)
    g.fillStyle(0x1a0a00, 1);
    g.fillCircle(14, 31, 4);
    g.fillCircle(26, 31, 4);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(15, 30, 1.5);
    g.fillCircle(27, 30, 1.5);
    // Angry brows
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(10, 25, 9, 2.5);
    g.fillRect(21, 25, 9, 2.5);
    // Dripping spout
    g.fillStyle(lightColor, 1);
    g.fillRect(16, 52, 8, 6);
    g.fillCircle(20, 59, 5);
    // Mean mouth
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(12, 38, 16, 3);
    g.fillRect(12, 36, 3, 4);
    g.fillRect(25, 36, 3, 4);
    g.generateTexture(key, 40, 64);
    g.destroy();
  }

  _makePowerUps() {
    this._drawPowerUp('ketchup_pu', 0xFF2222, 0xFF8888);
    this._drawPowerUp('mustard_pu', 0xFFCC00, 0xFFEE88);
    this._drawPowerUp('mayo_pu', 0xF5F5DC, 0xFFFFFF);
    this._drawPowerUp('relish_pu', 0x55CC55, 0xAAFF88);
  }

  // Draw a star polygon using fillPoints (fillStar is not a Phaser API method)
  _fillStar(g, cx, cy, outerR, innerR, numPoints) {
    const pts = [];
    for (let i = 0; i < numPoints * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI / numPoints) - Math.PI / 2;
      pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    g.fillPoints(pts, true);
  }

  _drawPowerUp(key, color, glowColor) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Glow ring
    g.fillStyle(glowColor, 0.4);
    g.fillCircle(18, 20, 18);
    // Bottle body
    g.fillStyle(color, 1);
    g.fillRoundedRect(8, 8, 20, 28, 6);
    // Cap
    g.fillStyle(0x333333, 1);
    g.fillRoundedRect(10, 4, 16, 8, 3);
    // Shine
    g.fillStyle(0xffffff, 0.5);
    g.fillRoundedRect(11, 11, 5, 12, 2);
    // Star sparkle
    g.fillStyle(0xFFFFFF, 1);
    this._fillStar(g, 18, 4, 4, 2, 5);
    g.generateTexture(key, 36, 36);
    g.destroy();
  }

  _makeProjectile() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Condiment blob projectile
    g.fillStyle(0xFF4400, 1);
    g.fillCircle(8, 8, 8);
    g.fillStyle(0xFF8800, 0.7);
    g.fillCircle(6, 6, 4);
    g.generateTexture('projectile', 16, 16);
    g.destroy();

    // Per-type projectiles
    const projColors = {
      ketchup_pu: 0xFF2222,
      mustard_pu: 0xFFCC00,
      mayo_pu:    0xFFFAEA,
      relish_pu:  0x44CC44,
    };
    for (const [key, col] of Object.entries(projColors)) {
      const gp = this.make.graphics({ x: 0, y: 0, add: false });
      gp.fillStyle(col, 1);
      gp.fillCircle(8, 8, 8);
      gp.fillStyle(0xffffff, 0.5);
      gp.fillCircle(6, 6, 3);
      gp.generateTexture('proj_' + key, 16, 16);
      gp.destroy();
    }
  }

  _makePlatform() {
    // Tile-able 32×20 platform tile
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x8B4513, 1);
    g.fillRect(0, 4, 32, 16);
    g.fillStyle(0xA0522D, 1);
    g.fillRect(0, 4, 32, 5);
    g.fillStyle(0x6B3410, 1);
    g.fillRect(0, 16, 32, 4);
    // Grass top
    g.fillStyle(0x5aaa44, 1);
    g.fillRect(0, 0, 32, 6);
    g.fillStyle(0x44aa22, 1);
    g.fillCircle(8, 1, 5);
    g.fillCircle(16, 0, 4);
    g.fillCircle(24, 1, 5);
    g.generateTexture('platform_tile', 32, 20);
    g.destroy();
  }

  _makeGround() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x4a7c59, 1);
    g.fillRect(0, 0, 800, 50);
    g.fillStyle(0x6abf69, 1);
    g.fillRect(0, 0, 800, 8);
    g.generateTexture('ground', 800, 50);
    g.destroy();
  }

  _makeFlag() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Pole
    g.fillStyle(0xaaaaaa, 1);
    g.fillRect(4, 0, 6, 80);
    // Flag cloth
    g.fillStyle(0xFF0000, 1);
    g.fillTriangle(10, 4, 10, 34, 36, 19);
    // Checkered pattern
    g.fillStyle(0xffffff, 1);
    g.fillRect(10, 4, 13, 15);
    g.fillRect(23, 19, 13, 15);
    g.generateTexture('flag', 40, 80);
    g.destroy();
  }

  _makeHeart() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    // Full heart
    g.fillStyle(0xFF2244, 1);
    g.fillCircle(8, 9, 8);
    g.fillCircle(20, 9, 8);
    g.fillTriangle(0, 12, 14, 30, 28, 12);
    g.generateTexture('heart', 28, 30);
    g.destroy();

    // Empty heart
    const ge = this.make.graphics({ x: 0, y: 0, add: false });
    ge.fillStyle(0x555555, 1);
    ge.fillCircle(8, 9, 8);
    ge.fillCircle(20, 9, 8);
    ge.fillTriangle(0, 12, 14, 30, 28, 12);
    ge.generateTexture('heart_empty', 28, 30);
    ge.destroy();
  }

  _makeStarParticle() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xFFFF00, 1);
    this._fillStar(g, 8, 8, 8, 4, 5);
    g.generateTexture('star', 16, 16);
    g.destroy();
  }
}

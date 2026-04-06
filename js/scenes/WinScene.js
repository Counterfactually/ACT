// ============================================================
//  WinScene — Level complete  (iPad-mini safe layout)
//  All content kept within y 0–460 to avoid canvas clipping
// ============================================================

class WinScene extends Phaser.Scene {
  constructor() { super('WinScene'); }

  init(data) {
    this._level      = data.level      || 1;
    this._score      = data.score      || 0;
    this._timeBonus  = data.timeBonus  || 0;
    this._health     = data.health     || PLAYER_CFG.MAX_HEALTH;
    this._totalScore = this._score + this._timeBonus;
  }

  create() {
    const isLast = this._level >= LEVELS.length;
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT,
      isLast ? 0x1a3300 : 0x0a2244);

    // Star burst
    const em = this.add.particles(GAME.WIDTH / 2, GAME.HEIGHT / 2, 'star', {
      speed: { min: 100, max: 320 }, scale: { start: 1, end: 0 },
      lifespan: 1200, quantity: 0, emitting: false,
    });
    em.explode(28, GAME.WIDTH / 2, GAME.HEIGHT / 2);

    const hdr = { fontSize: '22px', fill: '#ffffff', stroke: '#000', strokeThickness: 3, fontFamily: 'Arial Black, Arial' };

    // ── Title ─────────────────────────────────────────────────
    this.add.text(GAME.WIDTH / 2, 44,
      isLast ? '🏆 YOU WIN! 🏆' : `✅ LEVEL ${this._level} COMPLETE!`,
      { fontSize: isLast ? '44px' : '36px', fill: '#FFD700',
        stroke: '#000', strokeThickness: 8, fontFamily: 'Arial Black, Arial' }
    ).setOrigin(0.5);

    if (isLast) {
      this.add.text(GAME.WIDTH / 2, 96, 'The Chicken Nugget Hero saved the day!',
        { fontSize: '17px', fill: '#ffffff', fontFamily: 'Arial, sans-serif' }
      ).setOrigin(0.5);
    }

    // ── Score breakdown ───────────────────────────────────────
    const scoreY = isLast ? 126 : 106;

    this.add.text(GAME.WIDTH / 2, scoreY,
      `Level Score:   ${this._score.toLocaleString()}`, hdr).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, scoreY + 34,
      `Time Bonus:   +${this._timeBonus.toLocaleString()}`,
      { ...hdr, fill: '#88FF88' }).setOrigin(0.5);

    const lineY = scoreY + 70;
    const lineG = this.add.graphics();
    lineG.lineStyle(2, 0xffffff, 0.4);
    lineG.lineBetween(GAME.WIDTH / 2 - 200, lineY, GAME.WIDTH / 2 + 200, lineY);

    this.add.text(GAME.WIDTH / 2, lineY + 14,
      `TOTAL:   ${this._totalScore.toLocaleString()}`,
      { ...hdr, fill: '#FFD700', fontSize: '26px' }).setOrigin(0.5);

    // ── Hearts ────────────────────────────────────────────────
    const heartsY = lineY + 54;
    this.add.text(GAME.WIDTH / 2, heartsY, 'Health left:', {
      fontSize: '15px', fill: '#ffffff', fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    for (let i = 0; i < PLAYER_CFG.MAX_HEALTH; i++) {
      this.add.image(
        GAME.WIDTH / 2 - ((PLAYER_CFG.MAX_HEALTH - 1) * 16) + i * 32,
        heartsY + 26,
        i < this._health ? 'heart' : 'heart_empty'
      ).setScale(0.65);
    }

    // ── Buttons — stacked, well within canvas ─────────────────
    const btn1Y = heartsY + 70;
    const btn2Y = btn1Y + 76;

    const goNext = isLast
      ? () => this.scene.start('GameScene', { level: 1, score: 0 })
      : () => this.scene.start('GameScene', {
          level: this._level + 1,
          score: this._totalScore,
          health: this._health,
        });

    const goSecond = isLast
      ? () => this.scene.start('LeaderboardScene', { score: this._totalScore, fromWin: true })
      : () => this.scene.start('MenuScene');

    if (isLast) {
      this._makeButton(GAME.WIDTH / 2, btn1Y, '🔄  PLAY AGAIN', 0x226622, goNext);
      this._makeButton(GAME.WIDTH / 2, btn2Y, '🏆  VIEW SCORES', 0x884400, goSecond);
    } else {
      this._makeButton(GAME.WIDTH / 2, btn1Y, '▶  NEXT LEVEL', 0x226622, goNext);
      this._makeButton(GAME.WIDTH / 2, btn2Y, '🏠  MAIN MENU', 0x664400, goSecond);
    }

    // Keyboard shortcuts (also helps on iPad with external keyboard)
    this.input.keyboard.once('keydown-ENTER', goNext);
    this.input.keyboard.once('keydown-SPACE', goNext);
    this.input.keyboard.once('keydown-M',     goSecond);
  }

  _makeButton(x, y, label, color, callback) {
    const w = 340, h = 66;
    const bg = this.add.graphics().setDepth(10);
    const draw = (c) => {
      bg.clear();
      bg.fillStyle(c, 1);
      bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 16);
      bg.lineStyle(3, 0xffffff, 0.65);
      bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 16);
    };
    draw(color);

    const txt = this.add.text(x, y, label, {
      fontSize: '22px', fill: '#ffffff',
      stroke: '#000', strokeThickness: 4,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5).setDepth(11);

    let pressed = false;
    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true }).setDepth(12);
    zone.on('pointerdown', () => {
      if (pressed) return;
      pressed = true;
      draw(0xffffff);              // flash white on tap
      txt.setScale(0.92, 0.92);
      this.time.delayedCall(120, () => {
        draw(color);
        txt.setScale(1, 1);
        this.time.delayedCall(30, callback);   // defer scene transition
      });
    });
    zone.on('pointerover', () => { if (!pressed) { bg.setAlpha(0.85); } });
    zone.on('pointerout',  () => { if (!pressed) { bg.setAlpha(1); } });
  }
}

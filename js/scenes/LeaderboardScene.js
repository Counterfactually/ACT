// ============================================================
//  LeaderboardScene — High scores + name entry
// ============================================================

const LS_KEY = 'cnobby_scores';
const MAX_ENTRIES = 10;

class LeaderboardScene extends Phaser.Scene {
  constructor() { super('LeaderboardScene'); }

  init(data) {
    this._newScore   = (data && data.score != null) ? data.score : 0;
    this._gameOver   = (data && data.gameOver) || false;
    this._fromMenu   = (data && data.fromMenu) || false;
    this._fromWin    = (data && data.fromWin)  || false;
    this._highlight  = (data && data.highlight) || 0;
    this._submitted  = false;
  }

  create() {
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x0a0a1a);

    const needsEntry = (this._gameOver || this._fromWin)
                    && this._newScore > 0
                    && this._qualifies()
                    && !this._fromMenu;

    if (needsEntry) {
      this._showNameEntryScreen();
    } else {
      this._showBoardScreen();
    }
  }

  // ── Name entry (full screen) ─────────────────────────────

  _showNameEntryScreen() {
    // Dim overlay
    this.add.text(GAME.WIDTH / 2, 50,
      this._gameOver ? '💀 GAME OVER 💀' : '🏆 YOU WIN! 🏆',
      { fontSize: '40px', fill: '#FFD700', stroke: '#000', strokeThickness: 8, fontFamily: 'Arial Black, Arial' }
    ).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, 110,
      `Final Score: ${this._newScore.toLocaleString()}`,
      { fontSize: '26px', fill: '#88FFCC', stroke: '#000', strokeThickness: 4, fontFamily: 'Arial Black, Arial' }
    ).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, 165,
      '🏆 You made the leaderboard!',
      { fontSize: '22px', fill: '#FFD700', fontFamily: 'Arial, sans-serif' }
    ).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, 200,
      'Tap the button to enter your name',
      { fontSize: '17px', fill: '#ccddff', fontFamily: 'Arial, sans-serif' }
    ).setOrigin(0.5);

    // Big tap-friendly button
    this._makeButton(GAME.WIDTH / 2, 268, '✏️  ENTER YOUR NAME', 0x1155cc, 260, 68, () => {
      if (this._submitted) return;
      // window.prompt works on all browsers including Safari on iPad
      const raw = window.prompt('Type your name (up to 12 letters):', '');
      if (raw === null) return; // cancelled — don't save
      const name = (raw.trim().slice(0, 12)) || 'Nugget';
      this._submitted = true;
      this._saveScore(name, this._newScore);
      // Restart showing the board with the new score highlighted
      this.scene.restart({ fromMenu: true, highlight: this._newScore });
    });

    this._makeButton(GAME.WIDTH / 2 - 130, 360, '🔄 SKIP & PLAY', 0x444444, 220, 60, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });
    this._makeButton(GAME.WIDTH / 2 + 130, 360, '🏠 MENU', 0x664400, 220, 60, () => {
      this.scene.start('MenuScene');
    });
  }

  // ── Scoreboard screen ────────────────────────────────────

  _showBoardScreen() {
    const isJustViewing = this._fromMenu && !this._highlight;

    this.add.text(GAME.WIDTH / 2, 22,
      '🏆 HIGH SCORES 🏆',
      { fontSize: '32px', fill: '#FFD700', stroke: '#000', strokeThickness: 7, fontFamily: 'Arial Black, Arial' }
    ).setOrigin(0.5, 0);

    const scores = this._loadScores();
    const startY  = 68;
    const rowH    = 28;

    if (scores.length === 0) {
      this.add.text(GAME.WIDTH / 2, startY + 80, 'No scores yet — be the first!', {
        fontSize: '18px', fill: '#888888', fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);
    } else {
      // Headers
      this.add.text(GAME.WIDTH / 2 - 200, startY, '#',     { fontSize: '14px', fill: '#888', fontFamily: 'Arial' }).setOrigin(0, 0.5);
      this.add.text(GAME.WIDTH / 2 - 162, startY, 'NAME',  { fontSize: '14px', fill: '#888', fontFamily: 'Arial' }).setOrigin(0, 0.5);
      this.add.text(GAME.WIDTH / 2 + 170, startY, 'SCORE', { fontSize: '14px', fill: '#888', fontFamily: 'Arial' }).setOrigin(1, 0.5);

      scores.slice(0, MAX_ENTRIES).forEach((entry, i) => {
        const y      = startY + rowH + i * rowH;
        const isNew  = (entry.score === this._highlight && this._highlight > 0);
        const medal  = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        const col    = isNew ? '#88FFCC' : i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#dddddd';
        const fs     = i < 3 ? '18px' : '16px';
        const style  = { fontSize: fs, fill: col, fontFamily: 'Arial Black, Arial' };

        this.add.text(GAME.WIDTH / 2 - 200, y, medal,                       style).setOrigin(0, 0.5);
        this.add.text(GAME.WIDTH / 2 - 155, y, entry.name,                  style).setOrigin(0, 0.5);
        this.add.text(GAME.WIDTH / 2 + 170, y, entry.score.toLocaleString(), style).setOrigin(1, 0.5);
        if (isNew) {
          this.add.text(GAME.WIDTH / 2 + 185, y, '◀ YOU',
            { fontSize: '13px', fill: '#88FFCC', fontFamily: 'Arial' }
          ).setOrigin(0, 0.5);
        }
      });
    }

    // Nav buttons — large for iPad
    const btnY = GAME.HEIGHT - 46;
    this._makeButton(GAME.WIDTH / 2 - 130, btnY, '🔄 PLAY AGAIN', 0x226622, 230, 64, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });
    this._makeButton(GAME.WIDTH / 2 + 130, btnY, '🏠 MAIN MENU', 0x884400, 230, 64, () => {
      this.scene.start('MenuScene');
    });
  }

  _qualifies() {
    const scores = this._loadScores();
    return scores.length < MAX_ENTRIES
        || this._newScore > (scores[scores.length - 1] || { score: 0 }).score;
  }

  // ── localStorage ─────────────────────────────────────────

  _loadScores() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { return []; }
  }

  _saveScore(name, score) {
    const scores = this._loadScores();
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(LS_KEY, JSON.stringify(scores.slice(0, MAX_ENTRIES)));
  }

  // ── Button helper ─────────────────────────────────────────
  // Bigger default size (260×68) for iPad tap targets

  _makeButton(x, y, label, color, w = 260, h = 64, callback) {
    const bg = this.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 14);
    bg.lineStyle(3, 0xffffff, 0.55);
    bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 14);

    const txt = this.add.text(x, y, label, {
      fontSize: '20px', fill: '#ffffff',
      stroke: '#000', strokeThickness: 3,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', callback);
    zone.on('pointerover', () => this.tweens.add({ targets: txt, scaleX: 1.06, scaleY: 1.06, duration: 80 }));
    zone.on('pointerout',  () => this.tweens.add({ targets: txt, scaleX: 1,    scaleY: 1,    duration: 80 }));
  }
}

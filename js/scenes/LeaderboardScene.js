// ============================================================
//  LeaderboardScene — High scores + name entry
//  iPad-mini safe: all content within y 0–460
// ============================================================

const LS_KEY = 'cnobby_scores';
const MAX_ENTRIES = 10;

class LeaderboardScene extends Phaser.Scene {
  constructor() { super('LeaderboardScene'); }

  init(data) {
    this._newScore  = (data && data.score != null) ? data.score : 0;
    this._gameOver  = (data && data.gameOver) || false;
    this._fromMenu  = (data && data.fromMenu) || false;
    this._fromWin   = (data && data.fromWin)  || false;
    this._highlight = (data && data.highlight) || 0;
    this._submitted = false;
  }

  create() {
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x060614);

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

  // ── Name entry (own full screen) ─────────────────────────

  _showNameEntryScreen() {
    this.add.text(GAME.WIDTH / 2, 44,
      this._gameOver ? '💀 GAME OVER 💀' : '🏆 YOU WIN! 🏆',
      { fontSize: '40px', fill: '#FFD700', stroke: '#000', strokeThickness: 8, fontFamily: 'Arial Black, Arial' }
    ).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, 102,
      `Your score: ${this._newScore.toLocaleString()}`,
      { fontSize: '24px', fill: '#88FFCC', stroke: '#000', strokeThickness: 4, fontFamily: 'Arial Black, Arial' }
    ).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, 148, '🏆 You made the leaderboard!',
      { fontSize: '20px', fill: '#FFD700', fontFamily: 'Arial, sans-serif' }
    ).setOrigin(0.5);

    this.add.text(GAME.WIDTH / 2, 180, 'Tap the button to enter your name',
      { fontSize: '16px', fill: '#ccddff', fontFamily: 'Arial, sans-serif' }
    ).setOrigin(0.5);

    // Big enter-name button
    this._makeButton(GAME.WIDTH / 2, 254, '✏️   ENTER YOUR NAME', 0x1155cc, () => {
      if (this._submitted) return;
      const raw = window.prompt('Type your name (up to 12 letters):', '');
      if (raw === null) return;
      const name = (raw.trim().slice(0, 12)) || 'Nugget';
      this._submitted = true;
      this._saveScore(name, this._newScore);
      this.scene.restart({ fromMenu: true, highlight: this._newScore });
    });

    this._makeButton(GAME.WIDTH / 2, 338, '🔄  START OVER', 0x226622, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });

    this._makeButton(GAME.WIDTH / 2, 420, '🏠  MAIN MENU', 0x664400, () => {
      this.scene.start('MenuScene');
    });
  }

  // ── Scoreboard screen ─────────────────────────────────────

  _showBoardScreen() {
    this.add.text(GAME.WIDTH / 2, 20,
      '🏆  HIGH SCORES  🏆',
      { fontSize: '30px', fill: '#FFD700', stroke: '#000', strokeThickness: 7, fontFamily: 'Arial Black, Arial' }
    ).setOrigin(0.5, 0);

    const scores = this._loadScores();
    const startY = 60;
    const rowH   = 26;

    if (scores.length === 0) {
      this.add.text(GAME.WIDTH / 2, startY + 80, 'No scores yet — be the first!',
        { fontSize: '18px', fill: '#888888', fontFamily: 'Arial, sans-serif' }
      ).setOrigin(0.5);
    } else {
      // Column headers
      this.add.text(GAME.WIDTH / 2 - 200, startY, '#',     { fontSize: '13px', fill: '#777', fontFamily: 'Arial' }).setOrigin(0, 0.5);
      this.add.text(GAME.WIDTH / 2 - 162, startY, 'NAME',  { fontSize: '13px', fill: '#777', fontFamily: 'Arial' }).setOrigin(0, 0.5);
      this.add.text(GAME.WIDTH / 2 + 180, startY, 'SCORE', { fontSize: '13px', fill: '#777', fontFamily: 'Arial' }).setOrigin(1, 0.5);

      scores.slice(0, MAX_ENTRIES).forEach((entry, i) => {
        const y     = startY + rowH + i * rowH;
        const isNew = (entry.score === this._highlight && this._highlight > 0);
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
        const col   = isNew ? '#88FFCC' : i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#cccccc';
        const fs    = i < 3 ? '17px' : '15px';
        const st    = { fontSize: fs, fill: col, fontFamily: 'Arial Black, Arial' };

        this.add.text(GAME.WIDTH / 2 - 200, y, medal,                        st).setOrigin(0, 0.5);
        this.add.text(GAME.WIDTH / 2 - 155, y, entry.name,                   st).setOrigin(0, 0.5);
        this.add.text(GAME.WIDTH / 2 + 180, y, entry.score.toLocaleString(), st).setOrigin(1, 0.5);
        if (isNew) {
          this.add.text(GAME.WIDTH / 2 + 196, y, '◀ YOU',
            { fontSize: '12px', fill: '#88FFCC', fontFamily: 'Arial' }
          ).setOrigin(0, 0.5);
        }
      });
    }

    // Nav buttons — stacked, never below y=460
    this._makeButton(GAME.WIDTH / 2, 378, '🔄  PLAY AGAIN', 0x226622, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });
    this._makeButton(GAME.WIDTH / 2, 454, '🏠  MAIN MENU', 0x664400, () => {
      this.scene.start('MenuScene');
    });
  }

  // ── Helpers ───────────────────────────────────────────────

  _qualifies() {
    const scores = this._loadScores();
    return scores.length < MAX_ENTRIES
        || this._newScore > (scores[scores.length - 1] || { score: 0 }).score;
  }

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

  _makeButton(x, y, label, color, callback) {
    const w = 340, h = 66;
    const bg = this.add.graphics().setDepth(10);
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 16);
    bg.lineStyle(3, 0xffffff, 0.5);
    bg.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 16);

    const txt = this.add.text(x, y, label, {
      fontSize: '22px', fill: '#ffffff',
      stroke: '#000', strokeThickness: 3,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5).setDepth(11);

    let pressed = false;
    const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true }).setDepth(12);
    zone.on('pointerdown', () => {
      if (pressed) return;
      pressed = true;
      bg.setAlpha(0.6);
      txt.setScale(0.92, 0.92);
      this.time.delayedCall(120, () => {
        bg.setAlpha(1);
        txt.setScale(1, 1);
        this.time.delayedCall(30, callback);
      });
    });
    zone.on('pointerover', () => { if (!pressed) bg.setAlpha(0.85); });
    zone.on('pointerout',  () => { if (!pressed) bg.setAlpha(1); });
  }
}

// ============================================================
//  LeaderboardScene — High scores + optional name entry
// ============================================================

const LS_KEY = 'cnobby_scores';
const MAX_ENTRIES = 10;

class LeaderboardScene extends Phaser.Scene {
  constructor() { super('LeaderboardScene'); }

  init(data) {
    this._newScore = (data && data.score)    || 0;
    this._gameOver = (data && data.gameOver) || false;
    this._fromMenu = (data && data.fromMenu) || false;
    this._fromWin  = (data && data.fromWin)  || false;
    this._level    = (data && data.level)    || 0;
    this._playerName = '';
    this._submitted = false;
  }

  create() {
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x0a0a1a);

    // Title
    const titleTxt = this._gameOver
      ? '💀 GAME OVER 💀'
      : this._fromWin ? '🏆 HALL OF FAME 🏆' : '🏆 HIGH SCORES 🏆';
    this.add.text(GAME.WIDTH / 2, 30, titleTxt, {
      fontSize: '36px',
      fill: '#FFD700',
      stroke: '#000',
      strokeThickness: 8,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5, 0);

    if ((this._gameOver || this._fromWin) && this._newScore > 0) {
      this.add.text(GAME.WIDTH / 2, 78, `Your score: ${this._newScore.toLocaleString()}`, {
        fontSize: '20px',
        fill: '#88FFCC',
        stroke: '#000',
        strokeThickness: 3,
        fontFamily: 'Arial Black, Arial',
      }).setOrigin(0.5);
    }

    // Name entry if score qualifies
    if ((this._gameOver || this._fromWin) && this._newScore > 0 && this._qualifies()) {
      this._showNameEntry();
    } else {
      this._showBoard();
    }
  }

  _qualifies() {
    const scores = this._loadScores();
    return scores.length < MAX_ENTRIES || this._newScore > scores[scores.length - 1].score;
  }

  _showNameEntry() {
    this.add.text(GAME.WIDTH / 2, 115, 'You made the leaderboard! Enter your name:', {
      fontSize: '16px', fill: '#ffffff', fontFamily: 'Arial, sans-serif',
    }).setOrigin(0.5);

    // Name input box (using DOM element)
    const inputEl = document.createElement('input');
    inputEl.type = 'text';
    inputEl.maxLength = 12;
    inputEl.placeholder = 'Your name';
    inputEl.style.cssText = [
      'position:absolute',
      'left:50%',
      'transform:translateX(-50%)',
      `top:${140 + (window.innerHeight - GAME.HEIGHT) / 2}px`,
      'width:200px',
      'padding:8px 12px',
      'font-size:20px',
      'border-radius:8px',
      'border:3px solid #FFD700',
      'background:#1a2a4a',
      'color:#ffffff',
      'text-align:center',
      'outline:none',
      'z-index:999',
    ].join(';');
    document.body.appendChild(inputEl);
    inputEl.focus();

    const removeInput = () => {
      if (document.body.contains(inputEl)) document.body.removeChild(inputEl);
    };

    // SUBMIT button
    this._makeButton(GAME.WIDTH / 2, 200, '✅ SUBMIT', 0x226622, () => {
      if (this._submitted) return;
      this._submitted = true;
      const name = inputEl.value.trim() || 'Nugget';
      removeInput();
      this._saveScore(name, this._newScore);
      this._showBoard(true);
    });

    // Clean up input on scene shutdown
    this.events.once('shutdown', removeInput);

    // Also submit on Enter key
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        inputEl.dispatchEvent(new MouseEvent('blur'));
        const btn = document.querySelector('[data-submit]');
        this._submitted = true;
        const name = inputEl.value.trim() || 'Nugget';
        removeInput();
        this._saveScore(name, this._newScore);
        // Re-render board
        this.scene.restart({
          score: 0, gameOver: false, fromWin: false, fromMenu: true,
        });
      }
    });
  }

  _showBoard(highlight = false) {
    const scores = this._loadScores();
    const startY = this._fromMenu ? 85 : 230;

    if (scores.length === 0) {
      this.add.text(GAME.WIDTH / 2, startY + 60, 'No scores yet — be the first!', {
        fontSize: '18px', fill: '#888888', fontFamily: 'Arial, sans-serif',
      }).setOrigin(0.5);
    } else {
      // Column headers
      this.add.text(GAME.WIDTH / 2 - 180, startY, '#',     { fontSize: '15px', fill: '#aaaaaa', fontFamily: 'Arial' }).setOrigin(0, 0.5);
      this.add.text(GAME.WIDTH / 2 - 140, startY, 'NAME',  { fontSize: '15px', fill: '#aaaaaa', fontFamily: 'Arial' }).setOrigin(0, 0.5);
      this.add.text(GAME.WIDTH / 2 + 140, startY, 'SCORE', { fontSize: '15px', fill: '#aaaaaa', fontFamily: 'Arial' }).setOrigin(1, 0.5);

      scores.slice(0, MAX_ENTRIES).forEach((entry, i) => {
        const y = startY + 24 + i * 24;
        const isNew = highlight && entry.score === this._newScore && i === 0;
        const col = i === 0 ? '#FFD700' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#dddddd';
        const boldStyle = { fontSize: '17px', fill: isNew ? '#88FFCC' : col, fontFamily: 'Arial Black, Arial' };

        this.add.text(GAME.WIDTH / 2 - 180, y, `${i + 1}.`,       boldStyle).setOrigin(0, 0.5);
        this.add.text(GAME.WIDTH / 2 - 140, y, entry.name,         boldStyle).setOrigin(0, 0.5);
        this.add.text(GAME.WIDTH / 2 + 140, y, entry.score.toLocaleString(), boldStyle).setOrigin(1, 0.5);

        if (isNew) {
          this.add.text(GAME.WIDTH / 2 + 160, y, '← YOU!', {
            fontSize: '13px', fill: '#88FFCC', fontFamily: 'Arial',
          }).setOrigin(0, 0.5);
        }
      });
    }

    // Navigation buttons
    const btnY = GAME.HEIGHT - 46;
    this._makeButton(GAME.WIDTH / 2 - 110, btnY, '🔄 PLAY AGAIN', 0x226622, () => {
      this.scene.start('GameScene', { level: 1, score: 0 });
    });
    this._makeButton(GAME.WIDTH / 2 + 110, btnY, '🏠 MAIN MENU', 0x884400, () => {
      this.scene.start('MenuScene');
    });
  }

  // ── localStorage helpers ─────────────────────────────────

  _loadScores() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    } catch { return []; }
  }

  _saveScore(name, score) {
    const scores = this._loadScores();
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    localStorage.setItem(LS_KEY, JSON.stringify(scores.slice(0, MAX_ENTRIES)));
  }

  _makeButton(x, y, label, color, callback) {
    const bg = this.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(x - 105, y - 26, 210, 52, 12);
    bg.lineStyle(3, 0xffffff, 0.5);
    bg.strokeRoundedRect(x - 105, y - 26, 210, 52, 12);

    const txt = this.add.text(x, y, label, {
      fontSize: '18px',
      fill: '#ffffff',
      stroke: '#000',
      strokeThickness: 3,
      fontFamily: 'Arial Black, Arial',
    }).setOrigin(0.5);

    const zone = this.add.zone(x, y, 210, 52).setInteractive({ useHandCursor: true });
    zone.on('pointerdown', callback);
    zone.on('pointerover', () => this.tweens.add({ targets: txt, scaleX: 1.08, scaleY: 1.08, duration: 80 }));
    zone.on('pointerout',  () => this.tweens.add({ targets: txt, scaleX: 1, scaleY: 1, duration: 80 }));
  }
}

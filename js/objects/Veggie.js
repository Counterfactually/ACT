// ============================================================
//  Veggie — Healthy food enemy (stomp or shoot to defeat)
// ============================================================

class Veggie extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.type = type;
    this.setDepth(8);

    const sizes = {
      carrot:      { w: 30, h: 46 },
      broccoli:    { w: 38, h: 46 },
      celery:      { w: 42, h: 46 },
      spinach:     { w: 40, h: 40 },
      cabbage:     { w: 44, h: 44 },
      cauliflower: { w: 44, h: 44 },
    };
    const sz = sizes[type] || { w: 36, h: 44 };
    this.body.setSize(sz.w, sz.h);

    this._flying = (type === 'cauliflower');

    if (this._flying) {
      // Cauliflower floats in the air — no gravity, no platform collision needed
      this.body.setAllowGravity(false);
      this.body.setCollideWorldBounds(false);
      // Sine-wave bob is fine here because gravity is completely off
      scene.tweens.add({
        targets: this,
        y: y - 24,
        duration: 850 + Math.random() * 400,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    } else {
      this.body.setGravityY(GAME.GRAVITY);
      this.body.setCollideWorldBounds(true);
    }

    this._speed = 80;
    this._alive = true;
    this._walkDir = -1;
  }

  setSpeed(speed) {
    this._speed = speed;
    this.setVelocityX(this._walkDir * speed);
  }

  update() {
    if (!this._alive) return;

    if (this._flying) {
      // Flying veggies just move left at constant speed, no bouncing needed
      this.setVelocityX(-this._speed);
    } else {
      if (this.body.blocked.left)  { this._walkDir =  1; }
      if (this.body.blocked.right) { this._walkDir = -1; }
      this.setVelocityX(this._walkDir * this._speed);
      this.setFlipX(this._walkDir > 0);
    }
  }

  die(scene) {
    if (!this._alive) return;
    this._alive = false;
    this.setVelocityX(0);
    this.body.enable = false;

    scene.tweens.add({
      targets: this,
      scaleX: 1.6,
      scaleY: 0,
      alpha: 0,
      duration: 250,
      ease: 'Back.easeIn',
      onComplete: () => this.destroy(),
    });

    if (scene.starEmitter) {
      scene.starEmitter.explode(6, this.x, this.y);
    }
  }
}

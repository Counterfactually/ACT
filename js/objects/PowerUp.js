// ============================================================
//  PowerUp — Collectible condiment bottle
// ============================================================

class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type) {
    super(scene, x, y, type);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.puType = type; // 'ketchup_pu', 'mustard_pu', etc.
    this.setDepth(7);
    this.body.setSize(28, 30);
    this.body.setAllowGravity(false); // float in place
    this._alive = true;

    // Float bob
    scene.tweens.add({
      targets: this,
      y: y - 10,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Spin
    scene.tweens.add({
      targets: this,
      angle: 360,
      duration: 2000,
      repeat: -1,
    });
  }

  collect(scene) {
    if (!this._alive) return;
    this._alive = false;
    this.body.enable = false;

    scene.tweens.add({
      targets: this,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      onComplete: () => this.destroy(),
    });
  }
}

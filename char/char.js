import "phaser";

export class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        this._hp = 100;
        this._maxHp = 100;
        this._dead = false;
        this._jumping = false;
        this._bulletDamage = 2;
        this._weaponCount = 0;
        this._fireRate = 10;

        this.initPhysics(20, 32);
        this.initHpBar();

        this.scene.add.existing(this);
    }

    initPhysics(width, height) {
        this.scene.physics.world.enable(this);

        this.body.setSize(width, height);
        this.body.collideWorldBounds = true;
        this.body.onWorldBounds = true;
    }

    initHpBar() {
        const hpBarStroke = this.scene.add.graphics().setDepth(1);
        hpBarStroke.lineStyle(1, 0x000000);
        hpBarStroke.strokeRect(0, 0, 32, 5);

        const hpBarContent = this.scene.add.graphics().setDepth(1);
        hpBarContent.fillStyle(0x00ff00, 1);
        hpBarContent.fillRect(1, 1, 31, 3);

        const hpBarText = this.scene.add.text(0, 0, this.hp + '/' + this.maxHp)
            .setFontSize(8)
            .setDepth(1);

        const hpBar = this.scene.add.group();
        hpBar.addMultiple([hpBarStroke, hpBarContent, hpBarText]);

        this.setHpBarPosition(hpBar);
    }

    setHpBarPosition(hpBar) {
        hpBar.getChildren().forEach((component) => {
            component.setX(this.x - (this.width / 2));
            component.setY(this.y - 24);
        });
    }

    damage(amount) {
        this.hp -= amount;

        if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
        }
    }

    update() {
        if (this.body.blocked.down || (this.body.touching.down && this.jumping)) {
            this.jumping = false;
        }
    }

    updateHpBar() {
        const hpBarContent = this.hpBar.getChildren()[1];
        hpBarContent.clear();
        hpBarContent.fillStyle(0x00ff00, 1);
        hpBarContent.fillRect(1, 1, (31 / this.maxHp) * this.hp, 3);

        const hpBarText = this.hpBar.getChildren()[2];
        hpBarText.setText(this.hp + '');

        this.setHpBarPosition(this.hpBar);
    }

    getState() {
        return {
            hp: this.hp,
            maxHp: this.maxHp,
            bulletDamage: this.bulletDamage,
            weaponCount: this.weaponCount,
            fireRate: this.fireRate,
        };
    }

    applyState(state) {
        this.hp = state.hp;
        this.maxHp = state.maxHp;
        this.bulletDamage = state.bulletDamage;
        this.weaponCount = state.weaponCount;
        this.fireRate = state.fireRate;
    }

    get hp() {
        return this._hp;
    }

    set hp(value) {
        this._hp = value;
    }

    get maxHp() {
        return this._maxHp;
    }

    set maxHp(value) {
        this._maxHp = value;
    }

    get hpBar() {
        return this._hpBar;
    }

    set hpBar(value) {
        this._hpBar = value;
    }

    get dead() {
        return this._dead;
    }

    set dead(value) {
        this._dead = value;
    }

    get bulletDamage() {
        return this._bulletDamage;
    }

    set bulletDamage(value) {
        this._bulletDamage = value;
    }

    get weaponCount() {
        return this._weaponCount;
    }

    set weaponCount(value) {
        this._weaponCount = value;
    }

    get fireRate() {
        return this._fireRate;
    }

    set fireRate(value) {
        this._fireRate = value;
    }
}

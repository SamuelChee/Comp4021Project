import "phaser";
import { Bullet } from "./bullet";
import { Character } from "./character";

export class Player extends Character {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture);

        // position
        this.x = 400;
        this.y = 575;

        // equipment
        this.weapon = scene.add.sprite(this.x + 10, this.y + 15, "weapons");
        this.initWeapon();

        // states
        this.direction = "right";

        // input
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            w: scene.input.keyboard.addKey("W"),
            a: scene.input.keyboard.addKey("A"),
           // s: scene.input.keyboard.addKey("S"),
            d: scene.input.keyboard.addKey("D"),
        };

        this.initEvents();
    }

    initWeapon() {
        this.weapon.setFrame(3);
        this.weapon.setDepth(1);

        this.bulletDamage = 20;
        this.weaponCount = 1;
    }

    initEvents() {
        this.on("animationrepeat", () => {
            if (
                (this.anims.currentAnim.key === "playerWalking" && this.body.blocked.down) ||
                this.body.touching.down
            ) {
                this.scene.sound.play("step");
            }
        });
    }

    handleInput() {    
        if (this.cursors.up.isDown || this.wasd.w.isDown) {
            this.jump();
        }
    
        if (this.cursors.left.isDown || this.wasd.a.isDown) {
            this.body.setVelocityX(-200);
            this.anims.play("playerWalking", true);
            this.weapon.flipX = true;
            this.direction = "left";
            if (!this.loopedSound || !this.loopedSound.isPlaying) {
                this.loopedSound = this.scene.sound.add("step", { loop: true });
                this.loopedSound.play();
            }
        } else if (this.cursors.right.isDown || this.wasd.d.isDown) {
            this.body.setVelocityX(200);
            this.anims.play("playerWalking", true);
            this.weapon.flipX = false;
            this.direction = "right";
            if (!this.loopedSound || !this.loopedSound.isPlaying) {
                this.loopedSound = this.scene.sound.add("step", { loop: true });
                this.loopedSound.play();
            }
        } else {
            this.body.setVelocityX(0);
            this.anims.stop();
            if (this.loopedSound && this.loopedSound.isPlaying) {
                this.loopedSound.stop();
                this.loopedSound.destroy();
            }
        }
    }

    update() {
        super.update();

        this.handleInput();
        this.updateWeapon();
    }

    updateWeapon() {
        if (this.direction === "right") {
            this.weapon.x = this.x + 10;
            this.weapon.flipX = false;
        } else {
            this.weapon.flipX = true;
            this.weapon.x = this.x - 10;
        }

        this.weapon.y = this.y + 5;
    }

    shoot() {
        if (this.target && this.weaponCount > 0 && this.scene.input.activePointer.leftButtonDown()) {
            const shootY = Phaser.Math.Between(
                this.target.y - this.target.height / 2,
                this.target.y + this.target.height / 2
            );
            const angle = Phaser.Math.Angle.Between(this.x, this.y + 2, this.target.x, shootY);
            const velocity = this.scene.physics.velocityFromRotation(angle, 10);

            const bullet = this.bullets.create(this.x, this.y + 2, "bullet");
            bullet.setDepth(0);
            bullet.setVelocity(velocity.x, velocity.y);

            this.scene.sound.play("shot");
        }
    }
}
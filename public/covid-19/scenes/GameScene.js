class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene",
            active: true,
        });

        this.life = 3;
        this.lifeText;
        this.startTime;
        this.over = false;
        this.score = 0;
        this.playerSpeed = HEIGHT * 300 / 700;

        this.angleConfig = {
            min: 0,
            max: 360,
        };
        this.speedConfig = {
            min: 0,
            max: 200,
        };
        this.scaleConfig = {
            start: WIDTH * 1 / 800,
            end: 0,
            ease: "Linear",
        };
        this.alphaConfig = {
            start: 1,
            end: 0,
            ease: "Linear",
        };
    }

    preload() {
        this.load.image("background", "images/background.png");
        this.load.image("ground", "images/platform.png");
        this.load.image("covid", "images/covid.png");
        this.load.image("mask", "images/mask.png");
        this.load.spritesheet("dude", "images/dude.png", {
            frameWidth: 33.8,
            frameHeight: 39,
        });
        this.load.image("spark_red", "particles/red.png");
        this.load.image("spark_blue", "particles/blue.png");
        this.load.image("restart", "images/restart.png");
    }

    create() {
        this.add.image(WIDTH / 2, HEIGHT / 2, "background").setScale(WIDTH * 2 / 400);

        this.platforms = this.physics.add.staticGroup();
        this.covidEnd = this.physics.add.staticGroup();

        this.platforms
            .create(WIDTH / 2, HEIGHT, "ground")
            .setScale(WIDTH * 2 / 400)
            .refreshBody();

        this.covidEnd
            .create(WIDTH / 2, HEIGHT + (HEIGHT * 2 / 7), "ground")
            .setScale(WIDTH * 4 / 400)
            .refreshBody();

        this.player = this.physics.add.sprite(
            WIDTH / 2,
            HEIGHT / 2,
            "dude"
        ).setScale(WIDTH * 1 / 400);

        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 1,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 2,
                end: 3,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 4,
                end: 5,
            }),
            frameRate: 5,
            repeat: -1,
        });

        this.physics.add.collider(this.player, this.platforms);

        this.covids = this.physics.add.group({
            key: "covid",
            repeat: 10,
            setXY: { x: -(WIDTH * 1 / 4), y: this.randomInt(-(HEIGHT * 1 / 7), -(HEIGHT * 20 / 7)) },
            setScale: { x: WIDTH * 1 / 400, y: WIDTH * 1 / 400 }
        });

        this.physics.add.collider(this.covids);

        this.covidsElite = this.physics.add.group({
            key: "covid",
            repeat: 2,
            setXY: { x: -(WIDTH * 1 / 4), y: this.randomInt(-(HEIGHT * 1 / 7), -(HEIGHT * 20 / 7)) },
            setScale: { x: WIDTH * 1 / 400, y: WIDTH * 1 / 400 }
        });

        this.physics.add.overlap(
            this.covidEnd,
            this.covids,
            this.refall,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.covids,
            this.hit,
            null,
            this
        );

        this.physics.add.overlap(
            this.covidEnd,
            this.covidsElite,
            this.refallElite,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.covidsElite,
            this.hitElite,
            null,
            this
        );

        this.masks = this.physics.add.group({
            key: "mask",
            repeat: 0,
            setXY: { x: -(WIDTH * 1 / 4), y: this.randomInt(-(HEIGHT * 1 / 7), -(HEIGHT * 20 / 7)) },
            setScale: { x: WIDTH * 1 / 400, y: WIDTH * 1 / 400 }
        });

        this.physics.add.overlap(
            this.covidEnd,
            this.masks,
            this.refall,
            null,
            this
        );

        this.physics.add.overlap(
            this.player,
            this.masks,
            this.getMask,
            null,
            this
        );

        this.lifeText = this.add.text(WIDTH*16/400, WIDTH*16/400, "Life: 3", {
            fontSize: WIDTH * 16 / 400 + "px",
            fill: "#000",
        });

        this.scoreText = this.add.text(WIDTH*16/400, WIDTH*35/400, "Score: 0", {
            fontSize: WIDTH * 16 / 400 + "px",
            fill: "#000",
        });

        this.startTime = new Date().getTime();

        this.emitter_red = this.add.particles("spark_red").createEmitter({
            name: "spark_red",
            x: this.player.x,
            y: this.player.y,
            gravityY: 3000,
            speed: this.speedConfig,
            angle: this.angleConfig,
            scale: this.scaleConfig,
            alpha: this.alphaConfig,
            blendMode: "SCREEN",
            lifespan: 200,
        });

        this.emitter_red.setVisible(false);

        this.emitter_blue = this.add.particles("spark_blue").createEmitter({
            name: "spark_blue",
            x: this.player.x,
            y: this.player.y,
            gravityY: 3000,
            speed: this.speedConfig,
            angle: this.angleConfig,
            scale: this.scaleConfig,
            alpha: this.alphaConfig,
            blendMode: "SCREEN",
            lifespan: 200,
        });

        this.emitter_blue.setVisible(false);

        this.restart = this.add.image(WIDTH / 2, HEIGHT / 2, "restart").setScale(WIDTH * 1 / 400);
        this.restart.setVisible(false)
        // this.restart.setTint(0x00ff00);
    }

    update() {
        if (this.over === false) {
            let nowTime = new Date().getTime();
            let playTime = nowTime - this.startTime;

            this.score = Math.floor((playTime / 1000) * 5);
        }

        this.scoreText.setText("Score: " + this.score);
        this.lifeText.setText("Life: " + this.life);

        let cursors = this.input.keyboard.createCursorKeys();
        var pointer = this.input.activePointer;

        if (cursors.left.isDown || (pointer.isDown && pointer.x < WIDTH / 2)) {
            this.player.setVelocityX(-(this.playerSpeed));
            this.player.anims.play("left", true);
        } else if (cursors.right.isDown || (pointer.isDown && pointer.x > WIDTH / 2)) {
            this.player.setVelocityX(this.playerSpeed);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn", true);
        }

        this.emitter_red.setPosition(this.player.x, this.player.y);
        this.emitter_blue.setPosition(this.player.x, this.player.y);
    }

    refall(player, covid) {
        covid.disableBody(true, true);
        covid.enableBody(
            true,
            this.randomInt(covid.width / 2, WIDTH - (covid.width / 2)),
            this.randomInt(-(HEIGHT * 100 / 700), -(HEIGHT * 2000 / 700)),
            true,
            true
        );
    }

    refallElite(player, covid) {
        covid.disableBody(true, true);
        covid.enableBody(true, this.player.x, -(HEIGHT * 4), true, true);
    }

    hit(player, covid) {
        this.red_effect(player);
        this.life -= 1;
        if (this.life <= -1) {
            this.gameover(player);
        }
        this.lifeText.setText("Life: " + this.life);
        covid.disableBody(true, true);
        covid.enableBody(
            true,
            this.randomInt(covid.width / 2, WIDTH - (covid.width / 2)),
            this.randomInt(-(HEIGHT * 100 / 700), -(HEIGHT * 2000 / 700)),
            true,
            true
        );
    }

    hitElite(player, covid) {
        this.red_effect(player);
        this.life -= 1;
        if (this.life <= -1) {
            this.gameover(player);
        }
        this.lifeText.setText("Life: " + this.life);
        covid.disableBody(true, true);
        covid.enableBody(true, this.player.x, -(HEIGHT * 4), true, true);
    }

    getMask(player, mask) {
        this.blue_effect(player);
        this.life += 1;
        this.lifeText.setText("Life: " + this.life);
        mask.disableBody(true, true);
        mask.enableBody(
            true,
            this.randomInt(mask.width / 2, WIDTH - (mask.width / 2)),
            this.randomInt(-(HEIGHT * 100 / 700), -(HEIGHT * 2000 / 700)),
            true,
            true
        );
    }

    gameover(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        this.over = true;

        this.restart.setVisible(true);
        this.restart.setInteractive();

        this.restart.on('pointerdown', () => {
            this.restart.setTint(0x00ff00);
            this.life = 3;
            this.score = 0;
            this.over = false;
            this.scene.restart();
        });

        this.restart.on('pointerup', () => {
            this.restart.setTint(0xffffff);
        });
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    red_effect(player) {
        this.emitter_red.setVisible(true);
        setTimeout(() => {
            this.emitter_red.setVisible(false);
        }, 200);
    }

    blue_effect(player) {
        this.emitter_blue.setVisible(true);
        setTimeout(() => {
            this.emitter_blue.setVisible(false);
        }, 200);
    }
}

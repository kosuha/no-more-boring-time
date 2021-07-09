class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene",
            active: true
        });

        this.life = 3;
        this.lifeText;
        this.startTime;
    }

    preload() {
        this.load.image("background", "images/background.png");
        this.load.image("ground", "images/platform.png");
        this.load.image("covid", "images/covid.png");
        this.load.image("mask", "images/mask.png");
        this.load.spritesheet("dude", "images/dude.png", {
            frameWidth: 33.3,
            frameHeight: 39
        });
    }

    create() {
        this.add.image(400, 300, "background").setScale(2);

        this.platforms = this.physics.add.staticGroup();
        this.covidEnd = this.physics.add.staticGroup();

        this.platforms
            .create(CONFIG.width / 2, CONFIG.height, "ground")
            .setScale(2)
            .refreshBody();

        this.covidEnd
            .create(CONFIG.width / 2, CONFIG.height + 200, "ground")
            .setScale(4)
            .refreshBody();

        this.player = this.physics.add.sprite(
            CONFIG.width / 2,
            CONFIG.height / 2,
            "dude"
        );

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
            setXY: { x: -100, y: this.randomInt(-100, -2000) },
        });

        this.physics.add.overlap(this.covidEnd, this.covids, this.refall, null, this);
        this.physics.add.overlap(this.player, this.covids, this.hit, null, this);

        this.masks = this.physics.add.group({
            key: "mask",
            repeat: 0,
            setXY: { x: -100, y: this.randomInt(-100, -2000) },
        });

        this.physics.add.overlap(this.covidEnd, this.masks, this.refall, null, this);
        this.physics.add.overlap(this.player, this.masks, this.getMask, null, this);

        this.lifeText = this.add.text(16, 16, "Life: 3", {
            fontSize: "16px",
            fill: "#000",
        });

        this.scoreText = this.add.text(16, 16 + 18, "Score: 0", {
            fontSize: "16px",
            fill: "#000",
        });

        this.startTime = new Date().getTime();
    }

    update() {
        let nowTime = new Date().getTime();
        let playTime = nowTime - this.startTime;

        let score = Math.floor((playTime / 1000) * 5);

        this.scoreText.setText("Score: " + score);

        let cursors = this.input.keyboard.createCursorKeys();

        if (cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play("turn", true);
        }
    }

    refall(player, covid) {
        covid.disableBody(true, true);
        covid.enableBody(
            true,
            this.randomInt(12, CONFIG.width - 12),
            this.randomInt(-100, -2000),
            true,
            true
        );
    }

    hit(player, covid) {
        covid.disableBody(true, true);
        this.life -= 1;
        this.lifeText.setText("Life: " + this.life);
        covid.enableBody(
            true,
            this.randomInt(12, 800),
            this.randomInt(-100, -2000),
            true,
            true
        );
    }

    getMask(player, mask) {
        mask.disableBody(true, true);
        this.life += 1;
        this.lifeText.setText("Life: " + this.life);
        mask.enableBody(
            true,
            this.randomInt(12, 800),
            this.randomInt(-100, -2000),
            true,
            true
        );
    }

    gameover(player) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        gameOver = true;
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

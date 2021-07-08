class GameScene extends Phaser.Scene {
    constructor () {
        super({
            key:'GameScene'
        });
    }

    create () {
        console.log("game scene");
        this.add.image(400, 300, 'background').setScale(2);
        
        this.platforms = this.physics.add.staticGroup();
        this.covidEnd = this.physics.add.staticGroup();

        this.platforms.create(CONFIG.width / 2, CONFIG.height, 'ground').setScale(2).refreshBody();
        this.covidEnd.create(CONFIG.width / 2, CONFIG.height + 200, 'ground').setScale(4).refreshBody();

        this.player = this.physics.add.sprite(CONFIG.width / 2, CONFIG.height / 2, 'dude');
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.platforms);

        this.covids = this.physics.add.group({
            key: 'covid',
            repeat: 10,
            setXY: { x: -100, y: this.randomInt(-100, -2000) }
        })

        // this.physics.add.overlap(this.covidEnd, this.covids, refall, null, this);
        // this.physics.add.overlap(this.player, this.covids, hit, null, this);
        
        this.masks = this.physics.add.group({
            key: 'mask',
            repeat: 0,
            setXY: { x: -100, y: this.randomInt(-100, -2000) }
        })

        // this.physics.add.overlap(this.covidEnd, this.masks, refall, null, this);
        // this.physics.add.overlap(this.player, this.masks, getMask, null, this);

        // lifeText = this.add.text(16, 16, 'Life: 3', { fontSize: '16px', fill: '#000' });
        // scoreText = this.add.text(16, 16 + 18, 'Score: 0', { fontSize: '16px', fill: '#000' });

        // startTime = new Date().getTime();
    }

    update () {
        // let nowTime = new Date().getTime()
        // let playTime = nowTime - startTime
    
        // let score = Math.floor((playTime / 1000) * 5)
    
        // scoreText.setText('Score: ' + score);
        
        let cursors = this.input.keyboard.createCursorKeys();
    
        if (cursors.left.isDown) {
            this.player.setVelocityX(-300);
            this.player.anims.play('dude_left', true);
    
        } else if (cursors.right.isDown) {
            this.player.setVelocityX(300);
            this.player.anims.play('dude_right', true);
    
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('dude_straight', true);
        }
    
    }

    refall (player, covid){
        covid.disableBody(true, true);
        covid.enableBody(true, this.randomInt(12, CONFIG.width - 12), this.randomInt(-100, -2000), true, true);
    }

    hit (player, covid) {
        covid.disableBody(true, true);
        life -= 1;
        lifeText.setText('Life: ' + life);
        covid.enableBody(true, this.randomInt(12, 800), this.randomInt(-100, -2000), true, true);
    }

    getMask (player, mask) {
        mask.disableBody(true, true);
        life += 1;
        lifeText.setText('Life: ' + life);
        mask.enableBody(true, this.randomInt(12, 800), this.randomInt(-100, -2000), true, true);
    }

    gameover (player) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
    }

    randomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
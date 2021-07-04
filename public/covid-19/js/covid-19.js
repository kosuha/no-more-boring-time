const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let life = 3;
let lifeText;

function preload () {
    console.log("a")
    this.load.image('background', 'images/background.png');
    this.load.image('ground', 'images/platform.png');
    this.load.image('covid', 'images/covid.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.spritesheet('dude', 'images/dude.png',
        {frameWidth : 33.3, frameHeight : 39}
    );
}

function create () {
    this.add.image(400, 300, 'background');
    
    platforms = this.physics.add.staticGroup();
    starEnd = this.physics.add.staticGroup();

    platforms.create(400, 600, 'ground').setScale(2).refreshBody();
    starEnd.create(400, 800, 'ground').setScale(4).refreshBody();

    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    // player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: this.anims.generateFrameNumbers('dude', { start: 2, end: 3 }),
        frameRate: 5,
        repeat: -1
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 5 }),
        frameRate: 5,
        repeat: -1
    });

    this.physics.add.collider(player, platforms);

    // this.physics.add.sprite(randomInt(12, 800), randomInt(-100, -300), 'star');
    covids = this.physics.add.group({
        key: 'covid',
        repeat: 20,
        setXY: { x: -100, y: randomInt(-100, -2000) }
    })

    this.physics.add.overlap(starEnd, covids, collectStar, null, this);

    this.physics.add.overlap(player, covids, hit, null, this);

    lifeText = this.add.text(16, 16, 'Life: 3', { fontSize: '32px', fill: '#000' });

}

function update () {
    cursors = this.input.keyboard.createCursorKeys();

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
        player.anims.play('left', true);

    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
        player.anims.play('right', true);

    } else {
        player.setVelocityX(0);
        player.anims.play('turn', true);
    }

}

function collectStar (player, covid){
    covid.disableBody(true, true);
    covid.enableBody(true, randomInt(12, 800), randomInt(-100, -1000), true, true);
    // let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
}

function hit (player, covid) {
    covid.disableBody(true, true);
    life -= 1;
    lifeText.setText('Life: ' + life);
    covid.enableBody(true, randomInt(12, 800), randomInt(-100, -1000), true, true);

    // if (life === -1) {
    //     gameover(player)
    // }

}

function gameover (player) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
}

function randomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
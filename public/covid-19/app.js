const CONFIG = {
    type: Phaser.AUTO,
    backgroundColor: '#000000',
    scene: [IntroScene, ProgressScene],
    scale: {
        mode: Phaser.Scale.FIT,
        width: 400,
        height: 700,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: true
        }
    },
    pixelArt: false
};

const GAME = new Phaser.Game(CONFIG);
const WIDTH = GAME.config.width;
const HEIGHT = GAME.config.height;
const EMITTER = new Phaser.Events.EventEmitter();

// let life = 3;
// let lifeText;
// let startTime;

// function preload () {
//     this.load.image('background', 'images/background.png');
//     this.load.image('ground', 'images/platform.png');
//     this.load.image('covid', 'images/covid.png');
//     this.load.image('bomb', 'images/bomb.png');
//     this.load.image('mask', 'images/mask.png');
//     this.load.spritesheet('dude', 'images/dude.png',
//         {frameWidth : 33.3, frameHeight : 39}
//     );
// }

// function create () {
//     this.add.image(400, 300, 'background').setScale(2);
    
//     platforms = this.physics.add.staticGroup();
//     covidEnd = this.physics.add.staticGroup();

//     platforms.create(CONFIG.width / 2, CONFIG.height, 'ground').setScale(2).refreshBody();
//     covidEnd.create(CONFIG.width / 2, CONFIG.height + 200, 'ground').setScale(4).refreshBody();

//     // platforms.create(600, 400, 'ground');
//     // platforms.create(50, 250, 'ground');
//     // platforms.create(750, 220, 'ground');

//     player = this.physics.add.sprite(CONFIG.width / 2, CONFIG.height / 2, 'dude');

//     // player.setBounce(0.2);
//     player.setCollideWorldBounds(true);

//     this.anims.create({
//         key: 'left',
//         frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 1 }),
//         frameRate: 5,
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'turn',
//         frames: this.anims.generateFrameNumbers('dude', { start: 2, end: 3 }),
//         frameRate: 5,
//         repeat: -1
//     });

//     this.anims.create({
//         key: 'right',
//         frames: this.anims.generateFrameNumbers('dude', { start: 4, end: 5 }),
//         frameRate: 5,
//         repeat: -1
//     });

//     this.physics.add.collider(player, platforms);

//     // this.physics.add.sprite(randomInt(12, 800), randomInt(-100, -300), 'star');
//     covids = this.physics.add.group({
//         key: 'covid',
//         repeat: 10,
//         setXY: { x: -100, y: randomInt(-100, -2000) }
//     })

//     this.physics.add.overlap(covidEnd, covids, refall, null, this);
//     this.physics.add.overlap(player, covids, hit, null, this);
    
//     masks = this.physics.add.group({
//         key: 'mask',
//         repeat: 0,
//         setXY: { x: -100, y: randomInt(-100, -2000) }
//     })

    

//     this.physics.add.overlap(covidEnd, masks, refall, null, this);
//     this.physics.add.overlap(player, masks, getMask, null, this);

//     lifeText = this.add.text(16, 16, 'Life: 3', { fontSize: '16px', fill: '#000' });
//     scoreText = this.add.text(16, 16 + 18, 'Score: 0', { fontSize: '16px', fill: '#000' });

//     startTime = new Date().getTime();

// }

// function update () {
//     let nowTime = new Date().getTime()
//     let playTime = nowTime - startTime

//     let score = Math.floor((playTime / 1000) * 5)

//     scoreText.setText('Score: ' + score);
    
//     cursors = this.input.keyboard.createCursorKeys();

//     if (cursors.left.isDown) {
//         player.setVelocityX(-300);
//         player.anims.play('left', true);

//     } else if (cursors.right.isDown) {
//         player.setVelocityX(300);
//         player.anims.play('right', true);

//     } else {
//         player.setVelocityX(0);
//         player.anims.play('turn', true);
//     }

// }

// function refall (player, covid){
//     covid.disableBody(true, true);
//     covid.enableBody(true, randomInt(12, CONFIG.width - 12), randomInt(-100, -2000), true, true);

// }

// function hit (player, covid) {
//     covid.disableBody(true, true);
//     life -= 1;
//     lifeText.setText('Life: ' + life);
//     covid.enableBody(true, randomInt(12, 800), randomInt(-100, -2000), true, true);

//     // if (life === -1) {
//     //     gameover(player)
//     // }

// }

// function getMask (player, mask) {
//     mask.disableBody(true, true);
//     life += 1;
//     lifeText.setText('Life: ' + life);
//     mask.enableBody(true, randomInt(12, 800), randomInt(-100, -2000), true, true);
// }

// function gameover (player) {
//     this.physics.pause();
//     player.setTint(0xff0000);
//     player.anims.play('turn');
//     gameOver = true;
// }

// function randomInt (min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }
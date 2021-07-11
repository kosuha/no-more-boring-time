var width = 0;
var height = 0;

if((window.innerWidth / window.innerHeight) > (400 / 700)) {
    width = window.innerHeight * 400 / 700;
    height = window.innerHeight;
} else {
    width = window.innerWidth;
    height = window.innerWidth * 700 / 400;
}

const CONFIG = {
    type: Phaser.AUTO,
    scene: [GameScene, GameOverScene],
    mode: Phaser.Scale.RESIZE,
    width: width,
    height: height,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: height * 2 / 7 },
            debug: false,
        },
    },
    pixelArt: false,
};

const GAME = new Phaser.Game(CONFIG);
const WIDTH = GAME.config.width;
const HEIGHT = GAME.config.height;
const EMITTER = new Phaser.Events.EventEmitter();
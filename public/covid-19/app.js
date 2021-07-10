const CONFIG = {
    type: Phaser.AUTO,
    scene: [GameScene, GameOverScene],
    mode: Phaser.Scale.FIT,
    width: 400,
    height: 700,
    // autoCenter: Phaser.Scale.CENTER_BOTH,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 200 },
            debug: false,
        },
    },
    pixelArt: false,
};

const GAME = new Phaser.Game(CONFIG);
const WIDTH = GAME.config.width;
const HEIGHT = GAME.config.height;
const EMITTER = new Phaser.Events.EventEmitter();
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameOverScene"
        });

    }

    preload() {
        
    }

    create() {
        // this.add.image(400, 300, "background").setScale(2);
        this.gameOverText = this.add.text(WIDTH / 2, HEIGHT / 2, "GAME OVER", {
            fontSize: "32px",
            fill: "#000",
        });
    }

    update() {
        
    }
}

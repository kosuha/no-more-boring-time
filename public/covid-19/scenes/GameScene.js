class GameScene extends Phaser.Scene {
    constructor () {
        super({
            key:'GameScene'
        });
    }

    create(){
        this.add.image(400, 300, 'background').setScale(2);
    
        // platforms = this.physics.add.staticGroup();
        // covidEnd = this.physics.add.staticGroup();

        // platforms.create(CONFIG.width / 2, CONFIG.height, 'ground').setScale(2).refreshBody();
        // covidEnd.create(CONFIG.width / 2, CONFIG.height + 200, 'ground').setScale(4).refreshBody();
    }
}
class IntroScene extends Phaser.Scene {
    constructor () {
        super({
            key: 'IntroScene'
        })
    }

    preload () {
        this.load.image('loading_mask', 'images/mask.png');
    }

    create () {
        this.loading_mask = this.add.image(WIDTH / 2, HEIGHT / 2, 'loading_mask');
    }

    update () {
        this.loading_mask.rotation += 0.05
    }
}

class ProgressScene extends Phaser.Scene {
    constructor () {
        super({
            key: 'ProgressScene',
            active: true
        });
    }

    preload () {
        this.load.pack('pack','pack.json');
    }

    create(){
        // this.sleep(3000)
        this.scene.start('GameScene');
        // this.scene.start('UIScene');
        this.release();
    }

    release(){
        this.scene.get('IntroScene').loading_mask.destroy();
        this.textures.remove('mask');
        this.scene.destroy('IntroScene');
    }

    // sleep(ms) {
    //     const wakeUpTime = Date.now() + ms;
    //     while (Date.now() < wakeUpTime) {}
    // }
}
const socket = io();

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: "GameScene",
            active: true
        });
    }

    preload() {
    }

    create() {
        const url = new URL(window.location.href);
        const urlParams = url.searchParams;

        if (urlParams.has("room")) {
            socket.emit("joinRoom", { id: urlParams.get("room") });
        } else {
            socket.emit("GenerateRoom");

            this.invite = this.add.text(
                (WIDTH * 16) / 400,
                (WIDTH * 48) / 400,
                "invite",
                {
                    fontSize: (WIDTH * 16) / 400 + "px",
                    fill: "#FFFFFF",
                }
            );
            this.invite.setVisible(true);
            this.invite.setInteractive();

            this.invite.on("pointerdown", () => {
                console.log("invite button on!");
            });
        }

        socket.on('generatePlayer', (gameData) => {
            console.log(gameData);
        });
    }

    update() {
    }
}

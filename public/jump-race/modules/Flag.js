class Flag {
    constructor(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.velocityX = 0;
        this.velocityY = 0;
        this.taken = false;
        this.width = (HEIGHT * 50) / 700;
        this.height = (HEIGHT * 50) / 700;
    }

    display() {
        if (this.taken === false) {
            ctx.fillStyle = "rgb(100, 100, 100)";
            ctx.fillRect(
                this.positionX + (WIDTH * 22.5) / 400,
                this.positionY - (HEIGHT * 20) / 700,
                (WIDTH * 5) / 400,
                (HEIGHT * 70) / 700
            );
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(
                this.positionX + (WIDTH * 27.5) / 400,
                this.positionY - (HEIGHT * 15) / 700,
                (WIDTH * 40) / 400,
                (HEIGHT * 30) / 700
            );
        } else {
            ctx.fillStyle = "rgb(100, 100, 100)";
            ctx.fillRect(
                this.positionX + (WIDTH * 25.5) / 400,
                this.positionY - (HEIGHT * 25) / 700,
                (WIDTH * 2) / 400,
                (HEIGHT * 28) / 700
            );
            ctx.fillStyle = "rgb(255, 0, 0)";
            ctx.fillRect(
                this.positionX + (WIDTH * 27.5) / 400,
                this.positionY - (HEIGHT * 24) / 700,
                (WIDTH * 16) / 400,
                (HEIGHT * 12) / 700
            );
        }
    }

    drop() {
        if (this.taken === true) {
            this.velocityY -= (HEIGHT * 30) / 700;
            this.taken = false;
        }
    }

    take(player) {
        if (player.getFlag === true) {
            this.setPosition(player.positionX, player.positionY);
        }
    }

    setPosition(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
    }
}

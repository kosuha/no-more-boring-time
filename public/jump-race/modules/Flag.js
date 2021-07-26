class Flag {
    constructor(positionX, positionY, taken) {
        this.positionX = (WIDTH * positionX) / 400;
        this.positionY = (HEIGHT * positionY) / 700;
        this.velocityX = 0;
        this.velocityY = 0;
        this.taken = taken;
        this.width = (HEIGHT * 50) / 700;
        this.height = (HEIGHT * 50) / 700;
        this.canvasSize = {
            x: WIDTH,
            y: HEIGHT,
        };
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
            this.setState(player.positionX, player.positionY, player.getFlag);
        }
    }

    setState(positionX, positionY, taken) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.taken = taken;
    }
}

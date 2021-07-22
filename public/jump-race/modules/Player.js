class Player {
    constructor(id, positionX, positionY, width, height, color, nickName) {
        this.id = id;
        this.nickName = nickName;
        this.positionX = (WIDTH * positionX) / 400;
        this.positionY = (HEIGHT * positionY) / 700;
        this.color = color;
        this.width = (WIDTH * width) / 400;
        this.height = (HEIGHT * height) / 700;
        this.speed = (WIDTH * 5) / 400;
        this.canvasSize = {
            x: WIDTH,
            y: HEIGHT,
        };
        this.jumping = false;
        this.velocityX = 0;
        this.velocityY = 0;
        this.keyInput = {
            left: false,
            right: false,
            up: false,
        };
        this.laps = 1;
    }

    getId() {
        return this.id;
    }

    getNickName() {
        return this.nickName;
    }

    setPosition(positionX, positionY) {
        this.positionX = positionX;
        this.positionY = positionY;
    }

    display() {
        ctx.fillStyle = this.color;

        ctx.font = "12px san-serif";
        ctx.fillText(
            this.nickName,
            this.positionX,
            this.positionY - (WIDTH * 10) / 400
        );

        if (this.velocityY != 0) {
            ctx.fillRect(
                this.positionX + (WIDTH * 5) / 400,
                this.positionY,
                this.width - (WIDTH * 10) / 400,
                this.height + (WIDTH * 10) / 400
            );

            ctx.lineWidth = (WIDTH * 2) / 400;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(
                this.positionX + (WIDTH * 5) / 400,
                this.positionY + (WIDTH * 12) / 400
            );
            ctx.lineTo(
                this.positionX + (WIDTH * 18) / 400,
                this.positionY + (WIDTH * 18) / 400
            );
            ctx.lineTo(
                this.positionX + (WIDTH * 5) / 400,
                this.positionY + (WIDTH * 24) / 400
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(
                this.positionX + (WIDTH * (50 - 5)) / 400,
                this.positionY + (WIDTH * 12) / 400
            );
            ctx.lineTo(
                this.positionX + (WIDTH * (50 - 18)) / 400,
                this.positionY + (WIDTH * 18) / 400
            );
            ctx.lineTo(
                this.positionX + (WIDTH * (50 - 5)) / 400,
                this.positionY + (WIDTH * 24) / 400
            );
            ctx.stroke();
        } else {
            ctx.fillRect(
                this.positionX,
                this.positionY,
                this.width,
                this.height
            );

            ctx.fillStyle = "white";
            ctx.fillRect(
                this.positionX + (WIDTH * 5) / 400,
                this.positionY + (WIDTH * 12) / 400,
                (WIDTH * 15) / 400,
                (WIDTH * 15) / 400
            );
            ctx.fillRect(
                this.positionX + (WIDTH * 30) / 400,
                this.positionY + (WIDTH * 12) / 400,
                (WIDTH * 15) / 400,
                (WIDTH * 15) / 400
            );

            if (this.velocityX < 0) {
                ctx.fillStyle = "black";
                ctx.fillRect(
                    this.positionX + (WIDTH * 33 - 3) / 400,
                    this.positionY + (WIDTH * 15) / 400,
                    (WIDTH * 8) / 400,
                    (WIDTH * 8) / 400
                );
                ctx.fillRect(
                    this.positionX + (WIDTH * 8 - 3) / 400,
                    this.positionY + (WIDTH * 15) / 400,
                    (WIDTH * 8) / 400,
                    (WIDTH * 8) / 400
                );
            } else if (this.velocityX > 0) {
                ctx.fillStyle = "black";
                ctx.fillRect(
                    this.positionX + (WIDTH * 33 + 3) / 400,
                    this.positionY + (WIDTH * 15) / 400,
                    (WIDTH * 8) / 400,
                    (WIDTH * 8) / 400
                );
                ctx.fillRect(
                    this.positionX + (WIDTH * 8 + 3) / 400,
                    this.positionY + (WIDTH * 15) / 400,
                    (WIDTH * 8) / 400,
                    (WIDTH * 8) / 400
                );
            } else {
                ctx.fillStyle = "black";
                ctx.fillRect(
                    this.positionX + (WIDTH * 33) / 400,
                    this.positionY + (WIDTH * 15) / 400,
                    (WIDTH * 8) / 400,
                    (WIDTH * 8) / 400
                );
                ctx.fillRect(
                    this.positionX + (WIDTH * 8) / 400,
                    this.positionY + (WIDTH * 15) / 400,
                    (WIDTH * 8) / 400,
                    (WIDTH * 8) / 400
                );
            }
        }
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
}

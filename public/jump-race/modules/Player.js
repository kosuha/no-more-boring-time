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
        this.score = 0;
        this.getFlag = false;
        this.waiting = true;
    }

    getId() {
        return this.id;
    }

    getNickName() {
        return this.nickName;
    }

    // 상태 업데이트
    setState(positionX, positionY, getFlag, waiting) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.getFlag = getFlag;
        this.waiting = waiting;
    }

    display() {
        if (this.waiting === true) {
            ctx.globalAlpha = "0.1";
        } else {
            ctx.globalAlpha = "1.0";
        }

        ctx.fillStyle = this.color;

        // 닉네임
        ctx.font = (WIDTH * 12) / 400 + "px san-serif";
        ctx.textAlign = "left";
        ctx.fillText(
            this.nickName,
            this.positionX,
            this.positionY - (WIDTH * 10) / 400
        );

        if (this.velocityY != 0) {
            // 지면에서 떨어져 있을 때
            // 몸통
            ctx.fillRect(
                this.positionX + (WIDTH * 5) / 400,
                this.positionY,
                this.width - (WIDTH * 10) / 400,
                this.height + (WIDTH * 10) / 400
            );

            // 왼쪽 눈
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

            // 오른쪽 눈
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
            // 지면을 밟고 있을 때
            ctx.fillRect(
                this.positionX,
                this.positionY,
                this.width,
                this.height
            );

            // 왼쪽, 오른쪽 눈
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

        //깃발
        if (this.getFlag === true) {
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

        ctx.globalAlpha = "1.0";
    }
}

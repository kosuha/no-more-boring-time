class Player {
    constructor(id, positionX, positionY, width, height, color, nickName) {
        this.id = id;
        this.nickName = nickName;
        this.positionX = (WIDTH * positionX) / 400;
        this.positionY = (HEIGHT * positionY) / 700;
        this.color = color;
        this.width = (WIDTH * width) / 400;
        this.height = (HEIGHT * height) / 700;
    }

    getId() {
        return this.id;
    }

    getNickName() {
        return this.nickName;
    }

    updatePosition(positionX, positionY) {
        this.positionX = this.lerp(
            this.positionX,
            (WIDTH * positionX) / 400,
            0.05
        );
        this.positionY = this.lerp(
            this.positionY,
            (HEIGHT * positionY) / 700,
            0.05
        );

        // this.positionX = WIDTH * positionX / 400;
        // this.positionY = HEIGHT * positionY / 700;
    }

    display() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
        ctx.font = "12px san-serif";
        ctx.fillText(
            this.nickName,
            this.positionX,
            this.positionY - (WIDTH * 10) / 400
        );
    }

    lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }
}

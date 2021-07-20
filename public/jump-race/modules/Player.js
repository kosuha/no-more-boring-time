class Player {
    constructor(id, positionX, positionY, color, nickName) {
        this.id = id;
        this.nickName = nickName;
        this.positionX = WIDTH * positionX / 400;
        this.positionY = HEIGHT * positionY / 700;
        this.color = color;
    }

    getId() {
        return this.id;
    }

    getNickName() {
        return this.nickName;
    }

    updatePosition(positionX, positionY) {
        this.positionX = WIDTH * positionX / 400;
        this.positionY = HEIGHT * positionY / 700;
    }

    display() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.positionX, this.positionY, 50, 50);
        ctx.font = '12px serif';
        ctx.fillText(this.nickName, this.positionX, this.positionY - (WIDTH * 10 / 400))
    }
}
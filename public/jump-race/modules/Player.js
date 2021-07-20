class Player {
    constructor(id, positionX, positionY, color) {
        this.id = id;
        this.nickName = "testnick";
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
    }
}
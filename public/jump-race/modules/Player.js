class Player {
    constructor(id, positionX, positionY, width, height, color, nickName) {
        this.id = id;
        this.nickName = nickName;
        this.positionX = (WIDTH * positionX) / 400;
        this.positionY = (HEIGHT * positionY) / 700;
        this.color = color;
        this.width = (WIDTH * width) / 400;
        this.height = (HEIGHT * height) / 700;
        this.speed = (WIDTH * 5) / 400;;
        this.canvasSize = {
            x: WIDTH,
            y: HEIGHT
        }
    }

    getId() {
        return this.id;
    }

    getNickName() {
        return this.nickName;
    }

    setPosition (positionX, positionY) {
        this.positionX = positionX; 
        this.positionY = positionY;
    }

    goLeft() {
        this.positionX -= this.speed;
        // this.positionX = this.lerp(this.positionX, this.positionX - this.speed, 0.1);
    }

    goRight() {
        this.positionX += this.speed;
        // this.positionX = this.lerp(this.positionX, this.positionX + this.speed, 0.1);
    }

    goUp() {
        this.positionY -= this.speed;
        // this.positionX = this.lerp(this.positionX, this.positionX + this.speed, 0.1);
    }

    goDown() {
        this.positionY += this.speed;
        // this.positionX = this.lerp(this.positionX, this.positionX + this.speed, 0.1);
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

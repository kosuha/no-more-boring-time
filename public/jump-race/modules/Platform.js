class Platform {
    constructor(positionX, positionY, platformWidth, platformHeight) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = platformWidth;
        this.height = platformHeight;
    }

    display(){
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(this.positionX, this.positionY, this.width, (HEIGHT * 10) / 700);
    }
}

class Wall {
    constructor(positionX, positionY, platformWidth, platformHeight) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = platformWidth;
        this.height = platformHeight;
    }

    display(){
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
    }
}
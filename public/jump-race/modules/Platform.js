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

class Flag {
    constructor (positionX, positionY){
        this.positionX = positionX;
        this.positionY = positionY;
    }

    display (){
        ctx.fillStyle = 'rgb(100, 100, 100)';
        ctx.fillRect(this.positionX + (WIDTH * 22.5) / 400, this.positionY - (HEIGHT * 20) / 700, (WIDTH * 5) / 400, (HEIGHT * 70) / 700);
        ctx.fillStyle = 'rgb(255, 0, 0)';
        ctx.fillRect(this.positionX + (WIDTH * 27.5) / 400, this.positionY - (HEIGHT * 15) / 700, (WIDTH * 40) / 400, (HEIGHT * 30) / 700);
    }
}
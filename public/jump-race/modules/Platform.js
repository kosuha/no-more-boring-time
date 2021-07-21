class Platform {
    constructor(positionX, positionY, platformWidth, platformHeight) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = platformWidth;
        this.height = platformHeight;
    }

    display(){
        ctx.fillStyle = 'black';
        ctx.fillRect(this.positionX, this.positionY, this.platformWidth, this.platformHeight);
    }
}
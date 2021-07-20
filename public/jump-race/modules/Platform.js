class Platform {
    constructor() {
    }

    display(positionX, positionY, platformWidth, platformHeight){
        ctx.fillStyle = 'black';
        ctx.fillRect(positionX, positionY, platformWidth, platformHeight);
    }
}
// 바닥
class Platform {
    constructor(positionX, positionY, platformWidth, platformHeight) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = platformWidth;
        this.height = platformHeight; // 바닥 두께가 얇으면 중력이 강할 때 바닥을 통과함
    }

    display(){
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.fillRect(this.positionX, this.positionY, this.width, (HEIGHT * 10) / 700);
    }
}

// 벽
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
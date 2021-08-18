module.exports =  class Player {
    constructor(id, nickName) {
        this.id = id;
        this.nickName = nickName;
        this.width = 50;
        this.height = 50;
        this.positionX = 200 - this.width / 2;
        this.positionY = 500 - this.height / 2;
        this.speed = 10;
        this.getFlag = false;
        this.ready = false;
        this.waiting = true;
        this.color =
            "rgba(" +
            randomNumber(50, 200) +
            "," +
            randomNumber(50, 200) +
            "," +
            randomNumber(50, 200) +
            "," +
            0.7 +
            ")";
    }

    getId() {
        return this.id;
    }

    setState(positionX, positionY, getFlag, waiting) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.getFlag = getFlag;
        this.waiting = waiting;
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = class Flag {
    constructor() {
        this.positionX = 290;
        this.positionY = 200;
        this.taken = false;
    }

    setState(positionX, positionY, taken) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.taken = taken;
    }
}
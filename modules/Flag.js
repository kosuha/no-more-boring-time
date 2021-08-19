module.exports = class Flag {
    constructor() {
        this.positionX = 290;
        this.positionY = 200;
        this.taken = false;
    }

    // 깃발의 상태 업데이트
    setState(positionX, positionY, taken) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.taken = taken;
    }
}
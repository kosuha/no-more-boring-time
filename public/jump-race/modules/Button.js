class Button {
    constructor(positionX, positionY, width, height, text) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
        this.use = true;
        this.text = text;
    }

    // 마우스 포지션이 버튼 안에 있는지 체크
    isInside(mousePositionX, mousePositionY) {
        return (
            mousePositionX > this.positionX &&
            mousePositionX < this.positionX + this.width &&
            mousePositionY < this.positionY + this.height &&
            mousePositionY > this.positionY
        );
    }

    display() {
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
        ctx.lineWidth = (WIDTH * 1) / 400;
        ctx.strokeRect(this.positionX, this.positionY, this.width, this.height);

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = (WIDTH * 12) / 400 + "px san-serif";
        ctx.textAlign = "center";
        ctx.fillText(
            this.text,
            this.positionX + this.width / 2,
            this.positionY + this.height / 2
        );
    }

    setText() {
        if (this.use === true) {
            this.text = "준비";
        } else {
            this.text = "준비완료";
        }
    }
}

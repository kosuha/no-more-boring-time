class Button {
    constructor(positionX, positionY, width, height) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.width = width;
        this.height = height;
    }

    isInside(mousePositionX, mousePositionY) {
        return (
            mousePositionX > this.positionX &&
            mousePositionX < this.positionX + this.width &&
            mousePositionY < this.positionY + this.height &&
            mousePositionY > this.positionY
        );
    }

    display() {
        // this.addClickEvent(func);
        ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
        ctx.fillRect(this.positionX, this.positionY, this.width, this.height);
        ctx.lineWidth = (WIDTH * 1) / 400;
        ctx.strokeRect(this.positionX, this.positionY, this.width, this.height);

        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = (WIDTH * 12) / 400 + "px san-serif";
        ctx.fillText(
            "친구초대",
            this.positionX + (WIDTH * 6) / 400,
            this.positionY + (WIDTH * 18) / 400
        );


    }
}

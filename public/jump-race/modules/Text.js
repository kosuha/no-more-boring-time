class Text {
    constructor() {
        this.text = "";
        this.use = true;
        this.positionX = WIDTH / 2;
        this.positionY = HEIGHT / 2;
    }

    display(winner) {
        if (this.use === true) {
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.font = (WIDTH * 12) / 400 + "px san-serif";
            ctx.textAlign = "center";
            ctx.fillText(winner, this.positionX, this.positionY);
        }
    }
}

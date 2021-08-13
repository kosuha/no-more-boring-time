class Text {
    constructor() {
        this.text = "";
        this.use = false;
        this.positionX = WIDTH / 2;
        this.positionY = HEIGHT / 2;
        this.color = "rgb(0, 0, 0)";
    }

    display() {
        if (this.use === true) {
            console.log("test!!!", this.text);
            ctx.fillStyle = this.color;
            ctx.font = (WIDTH * 30) / 400 + "px san-serif";
            ctx.textAlign = "center";
            ctx.fillText(this.text, this.positionX, this.positionY);

            setTimeout(() => {
                this.use = false;
            }, 3000);
        }
    }
}

class Rank {
    constructor(positionX, positionY) {
        this.rankList = [];
        this.positionX = positionX;
        this.positionY = positionY;
    }

    setRankList(rankList) {
        this.rankList = rankList;
    }

    winner(winPlayer) {
        if (winPlayer != undefined) {
            console.log("win: ", winPlayer);
        }
    }

    display() {
        ctx.font = (WIDTH * 12) / 400 + "px san-serif";
        let marginTop = 3;

        for (let i in this.rankList) {
            const number = parseInt(i) + 1;
            const text =
                number +
                ". " +
                this.rankList[i].nickName +
                " : " +
                this.rankList[i].score;
            ctx.fillStyle = this.rankList[i].color;
            ctx.fillText(
                text,
                this.positionX,
                this.positionY + (12 + marginTop) * number
            );
        }
    }
}

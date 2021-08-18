module.exports = class Rank {
    constructor() {
        this.rankList = [];
    }

    pushScore(player) {
        if (player.waiting === false) {
            let isPlayerInList = false;
            for (let i = 0; i < this.rankList.length; i++) {
                if (player.id === this.rankList[i].id) {
                    this.rankList[i].score = player.score;
                    isPlayerInList = true;
                }
            }
            if (isPlayerInList === false) {
                this.rankList.push(player);
            }
        }
    }

    popScore(id) {
        for (let i = 0; i < this.rankList.length; i++) {
            if (id === this.rankList[i].id) {
                this.rankList.splice(i, 1);
            }
        }
    }

    totalRank() {
        const result = this.rankList.sort(function (a, b) {
            return b.score - a.score;
        });
        return result;
    }

    winner(rankList) {
        if (rankList.length === 1 && rankList[0].score >= 1) {
            // console.log("a");
            return rankList[0];
        } else if (rankList.length >= 2 && rankList[0].score >= 2000) {
            // console.log("b");
            return rankList[0];
        } else {
            // console.log("c");
            return undefined;
        }
    }
}
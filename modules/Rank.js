module.exports = class Rank {
    constructor() {
        this.rankList = [];
    }

    // 랭크를 계산하기 위해 리스트에 플레이어를 추가
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

    // 리스트에서 제거
    popScore(id) {
        for (let i = 0; i < this.rankList.length; i++) {
            if (id === this.rankList[i].id) {
                this.rankList.splice(i, 1);
            }
        }
    }

    // 랭크 계산하여 정렬
    totalRank() {
        const result = this.rankList.sort(function (a, b) {
            return b.score - a.score;
        });
        return result;
    }

    // 승자 반환, 없을 시 undefined
    winner(rankList) {
        if (rankList.length === 1 && rankList[0].score >= 1) {
            return rankList[0];
        } else if (rankList.length >= 2 && rankList[0].score >= 2000) {
            return rankList[0];
        } else {
            return undefined;
        }
    }
}
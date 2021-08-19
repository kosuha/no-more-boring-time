module.exports = class Room {
    constructor(roomId, flag, rank) {
        this.name = roomId;
        this.members = {};
        this.inGamePlayers = {};
        this.gravity = 1;
        this.flag = flag;
        this.gameStart = false;
        this.rank = rank;
    }

    // 새로운 플레이어 추가
    pushMember(player) {
        this.members[player.getId()] = player;
    }

    // 플레이어 제거
    popMember(playerId) {
        if (playerId in this.members) {
            delete this.members[playerId];
        }
    }

    // 멤버 불러오기
    getMembers() {
        return this.members;
    }
}
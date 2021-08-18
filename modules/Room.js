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

    pushMember(player) {
        this.members[player.getId()] = player;
    }

    popMember(playerId) {
        if (playerId in this.members) {
            delete this.members[playerId];
        }
    }

    getMembers() {
        return this.members;
    }
}
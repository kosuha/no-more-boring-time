const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const http = require("http").Server(app);
const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const connection = require("./config/conn.js");
const kakaoCredentials = require("./config/kakao.json");
const session = require("express-session");
const sessionData = require("./config/session.json");
const MySQLStore = require("express-mysql-session")(session);
const sessionStoreConn = require("./config/sessionStoreConn.js");
const io = require("socket.io")(http);
const moment = require("moment");
require("moment-timezone");

const auth = require("./auth");
const covid19 = require("./router/covid-19");
const randomBlockPuzzle = require("./router/random-block-puzzle");
const alienHunter = require("./router/alien-hunter");
const jumpRace = require("./router/jump-race");

let visitNumber = 0;
let lastDate;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: sessionData.data.secret,
        resave: false,
        saveUninitialized: true,
        store: new MySQLStore(sessionStoreConn),
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(
    new kakaoStrategy(
        {
            clientID: kakaoCredentials.web.client_id,
            clientSecret: kakaoCredentials.web.client_secret,
            callbackURL: kakaoCredentials.web.callback_URL,
        },
        (accessToken, refreshToken, profile, done) => {
            const id = profile.id;
            const userName = profile.username;
            const nickName = profile.displayName;
            const profileImageURL = profile._json.properties.thumbnail_image;

            let user = {
                id: id,
                userName: userName,
                nickName: nickName,
                profileImageURL: profileImageURL,
            };

            visitNumber++;

            done(null, user);
        }
    )
);

app.get("/auth/kakao", passport.authenticate("kakao"));

app.get(
    "/auth/kakao/callback",
    passport.authenticate("kakao", { failureRedirect: "/signin" }),
    (request, response) => {
        response.redirect("/");
    }
);

app.get("/", auth, (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

app.get("/signin", (request, response) => {
    response.sendFile(__dirname + "/signin.html");
});

// socketIO
let rooms = {};
io.on("connection", async (socket) => {
    console.log("user connected: ", socket.id);

    moment.tz.setDefault("Asia/Seoul");
    let date = moment().format("DD");
    if (date != lastDate) {
        lastDate = date;
        visitNumber = 1;
    }

    io.emit("todayVisit", visitNumber);

    socket.on("disconnect", function () {
        console.log("user disconnected: ", socket.id);
        if (socket.gameData != undefined) {
            io.to(socket.gameData.joinedRoomId).emit("disconnected", socket.id);
            rooms[socket.gameData.joinedRoomId].popMember(socket.id);
            rooms[socket.gameData.joinedRoomId].rank.popScore(socket.id);
            socket.leave(socket.gameData.joinedRoomId);
            if (
                Object.keys(rooms[socket.gameData.joinedRoomId].members)
                    .length === 0
            ) {
                delete rooms[socket.gameData.joinedRoomId];
            }
        }
    });

    socket.on("joinRoom", (data) => {
        if (rooms[data.roomId] === undefined) {
            const flag = new Flag();
            const rank = new Rank();
            rooms[data.roomId] = new Room(data.roomId, flag, rank);
        }

        console.log(socket.id, "join room: ", data.roomId);
        socket.join(data.roomId);

        let player = new Player(socket.id, data.nickName);
        rooms[data.roomId].pushMember(player);
        socket.gameData = {
            player: player,
            joinedRoomId: data.roomId,
            roomData: rooms[data.roomId],
            flag: rooms[data.roomId].flag,
        };
        io.to(socket.gameData.joinedRoomId).emit(
            "generatePlayer",
            socket.gameData
        );

        console.log(rooms[data.roomId].getMembers());
    });

    socket.on("ready", (data) => {
        rooms[data.room].members[socket.id].ready = true;
    });

    socket.on("updateScore", (data) => {
        rooms[data.room].rank.pushScore(data.player);
        const result = rooms[data.room].rank.totalRank();
        const winPlayer = rooms[data.room].rank.winner(result);

        io.to(data.room).emit("updateScore", result);

        if (winPlayer != undefined) {
            const players = rooms[data.room].members;
            if (rooms[data.room].gameStart === true) {
                io.to(data.room).emit("win", winPlayer);
            }

            for (let id in players) {
                players[id].getFlag = false;
                players[id].ready = false;
                players[id].waiting = true;
            }

            rooms[data.room].gameStart = false;
        }
    });

    socket.on("updateFlagPosition", (data) => {
        const flagPositionX =
            (data.flag.positionX / data.flag.canvasSize.x) * 400;
        const flagPositionY =
            (data.flag.positionY / data.flag.canvasSize.y) * 700;

        rooms[data.room].flag.setState(
            flagPositionX,
            flagPositionY,
            data.flag.taken
        );
    });

    socket.on("updatePlayerPosition", (data) => {
        try {
            const updatePlayer = rooms[data.room].getMembers()[socket.id];
            const positionX =
                (data.player.positionX / data.player.canvasSize.x) * 400;
            const positionY =
                (data.player.positionY / data.player.canvasSize.y) * 700;
            updatePlayer.setState(positionX, positionY, data.player.getFlag);

            socket.broadcast.to(data.room).emit("updatePlayerPosition", {
                player: updatePlayer
            });
        } catch (error) {
            io.to(socket.id).emit("error");
            console.log("ERROR:updatePosition: ", error);
        }
    });
});

class Room {
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

class Player {
    constructor(id, nickName) {
        this.id = id;
        this.nickName = nickName;
        this.width = 50;
        this.height = 50;
        this.positionX = 200 - this.width / 2;
        this.positionY = 500 - this.height / 2;
        this.speed = 10;
        this.getFlag = false;
        this.ready = false;
        this.waiting = true;
        this.color =
            "rgba(" +
            randomNumber(50, 200) +
            "," +
            randomNumber(50, 200) +
            "," +
            randomNumber(50, 200) +
            "," +
            0.7 +
            ")";
    }

    getId() {
        return this.id;
    }

    setState(positionX, positionY, getFlag) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.getFlag = getFlag;
    }
}

class Flag {
    constructor() {
        this.positionX = 290;
        this.positionY = 200;
        this.taken = false;
    }

    setState(positionX, positionY, taken) {
        this.positionX = positionX;
        this.positionY = positionY;
        this.taken = taken;
    }
}

class Rank {
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
            console.log("a");
            return rankList[0];
        } else if (rankList.length >= 2 && rankList[0].score >= 2000) {
            console.log("b");
            return rankList[0];
        } else {
            console.log("c");
            return undefined;
        }
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.use("/covid-19", covid19);
app.use("/random-block-puzzle", randomBlockPuzzle);
app.use("/alien-hunter", alienHunter);
app.use("/jump-race", jumpRace);

http.listen(80, () => {
    console.log("########## app run! ##########");
});

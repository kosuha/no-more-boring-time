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
        socket.leave(socket.joinedRoomId);
    });

    socket.on("GenerateRoom", (nickName) => {
        const roomId = socket.id + "_room";
        console.log("-GenerateRoom-");
        const roomlink = "http://localhost/jump-race/?room=" + roomId;
        console.log(roomlink);
        socket.join(roomId);

        let player = new Player(socket.id, nickName);
        rooms[roomId] = new Room(roomId);
        rooms[roomId].pushMember(player);

        socket.gameData = {
            player: player,
            joinedRoomId: roomId,
            roomData: rooms[roomId],
        };

        io.to(socket.gameData.joinedRoomId).emit(
            "generatePlayer",
            socket.gameData
        );

        console.log(rooms[roomId].getMembers());
    });

    socket.on("joinRoom", (data) => {
        console.log(socket.id, "join room: ", data.roomId);
        socket.join(data.roomId);
        const playerListInRoom = io.sockets.adapter.rooms.get(data.roomId);
        console.log(playerListInRoom.size);

        let player = new Player(socket.id, data.nickName);
        rooms[data.roomId].pushMember(player);
        socket.gameData = {
            player: player,
            joinedRoomId: data.roomId,
            roomData: rooms[data.roomId],
        };
        io.to(socket.gameData.joinedRoomId).emit(
            "generatePlayer",
            socket.gameData
        );

        console.log(rooms[data.roomId].getMembers());
    });

    socket.on("keyInput", (data) => {
        const player = rooms[data.room].getMembers()[data.player];

        switch (data.input) {
            case "ArrowUp":
                player.goUp();
                break;
            case "ArrowDown":
                player.goDown();
                break;
            case "ArrowLeft":
                player.goLeft();
                break;
            case "ArrowRight":
                player.goRight();
                break;
            default:
                break;
        }

        io.to(data.room).emit("update", player);
    });
});

class Room {
    constructor(roomId) {
        this.name = roomId;
        this.members = {};
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
        this.positionX = 200;
        this.positionY = 350;
        this.speed = 10;
        this.gravity = 3;
        this.color = 'rgba('+randomNumber(100, 255)+','+randomNumber(100, 255)+','+randomNumber(100, 255)+')';
    }

    setNickName(nickName) {
        this.nickName = nickName;
    }

    getId() {
        return this.id;
    }

    getNickName() {
        return this.nickName;
    }

    getPosition() {
        return { x: this.positionX, y: this.positionY };
    }

    goLeft() {
        this.positionX -= this.speed;
    }

    goRight() {
        this.positionX += this.speed;
    }

    goUp() {
        this.positionY -= this.speed;
    }

    goDown() {
        this.positionY += this.speed;
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

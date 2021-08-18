// TODO
// 리팩토링
// 세부페이지로 바로 들어갔을때 로그인 시키기
// 주석 달기

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

const Room = require("./modules/Room");
const Player = require("./modules/Player");
const Flag = require("./modules/Flag");
const Rank = require("./modules/Rank");

// 방문자 수 체크 
let visitNumber = 0;
let lastDate;

// static 사용
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
        if (rooms[data.room].gameStart === false) {
            rooms[data.room].members[socket.id].ready = true;    
        }
    });

    socket.on("update", (data) => {
        try {
            let readyCheck = 0;
            for (let id in rooms[data.room].members) {
                if (rooms[data.room].members[id].ready) {
                    readyCheck++;
                }
            }
            if (Object.keys(rooms[data.room].members).length === readyCheck) {
                io.to(data.room).emit("start", rooms[data.room].members);
                rooms[data.room].gameStart = true;
            }
            

            const flagPositionX =
                (data.flag.positionX / data.flag.canvasSize.x) * 400;
            const flagPositionY =
                (data.flag.positionY / data.flag.canvasSize.y) * 700;

            rooms[data.room].flag.setState(
                flagPositionX,
                flagPositionY,
                data.flag.taken
            );

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
                rooms[data.room].rank.rankList = [];
            }

            const updatePlayer = rooms[data.room].getMembers()[socket.id];
            const positionX =
                (data.player.positionX / data.player.canvasSize.x) * 400;
            const positionY =
                (data.player.positionY / data.player.canvasSize.y) * 700;
            updatePlayer.setState(positionX, positionY, data.player.getFlag, data.player.waiting);

            socket.broadcast.to(data.room).emit("update", {
                player: updatePlayer,
                flag: rooms[data.room].flag
            });
        } catch (error) {
            io.to(socket.id).emit("error");
            console.log("ERROR:updatePosition: ", error);
        }
    });
});

app.use("/covid-19", covid19);
app.use("/random-block-puzzle", randomBlockPuzzle);
app.use("/alien-hunter", alienHunter);
app.use("/jump-race", jumpRace);

http.listen(80, () => {
    console.log("########## app run! ##########");
});

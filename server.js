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

// 세션 검사
const authenticateUser = (request, response, next) => {
    if (request.isAuthenticated()) {
        next();
    } else {
        response.status(301).redirect('/signin');
    }
};

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

app.get("/", authenticateUser, (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

app.get("/signin", (request, response) => {
    response.sendFile(__dirname + "/signin.html");
});

app.post("/logout", authenticateUser, (request, response) => {
    console.log("logout!");
    request.logOut();
    response.json({logout: true});
});

// socketIO
let rooms = {};
io.on("connection", async (socket) => {
    // 방문자 수 체크
    moment.tz.setDefault("Asia/Seoul");
    let date = moment().format("DD");
    if (date != lastDate) {
        lastDate = date;
        visitNumber = 1;
    }
    io.emit("todayVisit", visitNumber);

    // 접속이 끊어졌을 경우
    socket.on("disconnect", function () {
        // 클라이언트에 나간 유저를 알림, 나간 유저의 플레이어 정보를 삭제
        if (socket.gameData != undefined) {
            io.to(socket.gameData.joinedRoomId).emit("disconnected", socket.id);
            rooms[socket.gameData.joinedRoomId].popMember(socket.id);
            rooms[socket.gameData.joinedRoomId].rank.popScore(socket.id);
            socket.leave(socket.gameData.joinedRoomId);

            // 방에 멤버가 0명인 경우 방 삭제
            if (
                Object.keys(rooms[socket.gameData.joinedRoomId].members)
                    .length === 0
            ) {
                delete rooms[socket.gameData.joinedRoomId];
            }
        }
    });

    // 새로운 유저 접속 시
    socket.on("joinRoom", (data) => {
        // 방이 없다면 방, 깃발, 랭크 생성
        if (rooms[data.roomId] === undefined) {
            const flag = new Flag();
            const rank = new Rank();
            rooms[data.roomId] = new Room(data.roomId, flag, rank);
        }

        // 방에 입장
        socket.join(data.roomId);

        // 플레이어 생성, 추가, gameData에 정보 입력
        let player = new Player(socket.id, data.nickName);
        rooms[data.roomId].pushMember(player);
        socket.gameData = {
            player: player,
            joinedRoomId: data.roomId,
            roomData: rooms[data.roomId],
            flag: rooms[data.roomId].flag,
        };

        // 클라이언트에게 플레이어 생성을 알림
        io.to(socket.gameData.joinedRoomId).emit(
            "generatePlayer",
            socket.gameData
        );
    });

    // 클라이언트에게 게임 준비 신호를 받음
    socket.on("ready", (data) => {
        if (rooms[data.room].gameStart === false) {
            rooms[data.room].members[socket.id].ready = true;    
        }
    });

    // 게임 상태 업데이트
    socket.on("update", (data) => {
        try {
            // 게임 준비 체크
            let readyCheck = 0;
            for (let id in rooms[data.room].members) {
                if (rooms[data.room].members[id].ready) {
                    readyCheck++;
                }
            }
            // 모두 준비되면 시작
            if (Object.keys(rooms[data.room].members).length === readyCheck) {
                io.to(data.room).emit("start", rooms[data.room].members);
                rooms[data.room].gameStart = true;
            }
            
            // 깃발 상태
            const flagPositionX =
                (data.flag.positionX / data.flag.canvasSize.x) * 400;
            const flagPositionY =
                (data.flag.positionY / data.flag.canvasSize.y) * 700;

            rooms[data.room].flag.setState(
                flagPositionX,
                flagPositionY,
                data.flag.taken
            );

            // 점수와 랭크
            rooms[data.room].rank.pushScore(data.player);
            const result = rooms[data.room].rank.totalRank();
            const winPlayer = rooms[data.room].rank.winner(result);

            io.to(data.room).emit("updateScore", result);

            // 승자가 있다면 게임 종료
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

            // 플레이어 상태
            const updatePlayer = rooms[data.room].getMembers()[socket.id];
            const positionX =
                (data.player.positionX / data.player.canvasSize.x) * 400;
            const positionY =
                (data.player.positionY / data.player.canvasSize.y) * 700;
            updatePlayer.setState(positionX, positionY, data.player.getFlag, data.player.waiting);

            // 클라이언트에게 받은 정보를 다른 클라이언트에게 업데이트
            socket.broadcast.to(data.room).emit("update", {
                player: updatePlayer,
                flag: rooms[data.room].flag
            });
        } catch (error) {
            io.to(socket.id).emit("error");
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

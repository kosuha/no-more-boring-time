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
let players = {};
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

    socket.on("GenerateRoom", () => {
        const roomId = socket.id + "_room";
        console.log("-----------------GenerateRoom: ", roomId);
        socket.join(roomId);
        socket.gameData = {
            player: socket.id,
            joinedRoomId: roomId
        };
        io.to(socket.gameData.joinedRoomId).emit(
            "generatePlayer",
            socket.gameData
        );
    });

    socket.on("joinRoom", (room) => {
        console.log(socket.id, "join room: ", room.id);
        socket.join(room.id);
        const playerListInRoom = io.sockets.adapter.rooms.get(room.id);
        console.log(playerListInRoom.size);
        socket.gameData = {
            player: socket.id,
            joinedRoomId: room.id
        };
        io.to(socket.gameData.joinedRoomId).emit(
            "generatePlayer",
            socket.gameData
        );
    });
});

app.use("/covid-19", covid19);
app.use("/random-block-puzzle", randomBlockPuzzle);
app.use("/alien-hunter", alienHunter);
app.use("/jump-race", jumpRace);

http.listen(80, () => {
    console.log("########## app run! ##########");
});

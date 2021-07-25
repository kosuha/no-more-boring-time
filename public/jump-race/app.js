const socket = io();

var width = 0;
var height = 0;

if (window.innerWidth / window.innerHeight > 400 / 700) {
    width = (window.innerHeight * 400) / 700;
    height = window.innerHeight;
} else {
    width = window.innerWidth;
    height = (window.innerWidth * 700) / 400;
}

const isMobile = deviceCheck();

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = width;
canvas.height = height;

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let roomId;
let players = {};

const physics = new Physics();
const rank = new Rank((WIDTH * 5) / 400, (HEIGHT * 40) / 700, players);
const button = new Button(
    (WIDTH * 5) / 400,
    (HEIGHT * 5) / 700,
    (WIDTH * 54) / 400,
    (HEIGHT * 30) / 700
);
const floor = new Platform(
    (WIDTH * 200) / 400,
    (HEIGHT * 670) / 700,
    (WIDTH * 200) / 400,
    (HEIGHT * 50) / 700
);
const wallLeft = new Wall(
    (HEIGHT * -20) / 700,
    (HEIGHT * 0) / 700,
    (HEIGHT * 20) / 700,
    (HEIGHT * 700) / 700
);
const wallRight = new Wall(
    (HEIGHT * 400) / 700,
    (HEIGHT * 0) / 700,
    (HEIGHT * 20) / 700,
    (HEIGHT * 700) / 700
);
const floor2 = new Platform(
    (WIDTH * 0) / 400,
    (HEIGHT * 350) / 700,
    (WIDTH * 200) / 400,
    (HEIGHT * 50) / 700
);
const floor3 = new Platform(
    (WIDTH * 200) / 400,
    (HEIGHT * 450) / 700,
    (WIDTH * 100) / 400,
    (HEIGHT * 50) / 700
);
const floor4 = new Platform(
    (WIDTH * 300) / 400,
    (HEIGHT * 250) / 700,
    (WIDTH * 30) / 400,
    (HEIGHT * 50) / 700
);
const floor5 = new Platform(
    (WIDTH * 0) / 400,
    (HEIGHT * 600) / 700,
    (WIDTH * 150) / 400,
    (HEIGHT * 50) / 700
);

const flag = new Flag((WIDTH * 290) / 400, (HEIGHT * 200) / 700);

function setup(nickName) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const url = new URL(window.location.href);
    const urlParams = url.searchParams;

    if (urlParams.has("room")) {
        roomId = urlParams.get("room");
    } else {
        roomId = socket.id + "_room";
    }

    socket.emit("joinRoom", {
        roomId: roomId,
        nickName: nickName,
    });

    socket.on("generatePlayer", (gameData) => {
        setTimeout(() => {
            const members = gameData.roomData.members;
            for (let member in members) {
                if (member in players === false) {
                    players[member] = new Player(
                        member,
                        members[member].positionX,
                        members[member].positionY,
                        members[member].width,
                        members[member].height,
                        members[member].color,
                        members[member].nickName
                    );
                }
            }
        }, 3000);
    });

    socket.on("disconnected", (id) => {
        delete players[id];
    });

    socket.on("updatePosition", (data) => {
        players[data.player.id].setPosition(
            (WIDTH * data.player.positionX) / 400,
            (HEIGHT * data.player.positionY) / 700
        );
        flag.setPosition(data.flag.positionX, data.flag.positionY);
    });

    socket.on("rank", (rankList) => {
        rank.setRankList(rankList);
    });

    window.addEventListener("keydown", keyListener);
    window.addEventListener("keyup", keyListener);

    if (isMobile === true) {
        document
            .querySelector("#up-button")
            .addEventListener("touchstart" || "click", touchButtonUp);
        document
            .querySelector("#left-button")
            .addEventListener("touchstart" || "click", touchButtonLeft);
        document
            .querySelector("#right-button")
            .addEventListener("touchstart" || "click", touchButtonRight);
        document
            .querySelector("#up-button")
            .addEventListener("touchend" || "click", touchButtonUp);
        document
            .querySelector("#left-button")
            .addEventListener("touchend" || "click", touchButtonLeft);
        document
            .querySelector("#right-button")
            .addEventListener("touchend" || "click", touchButtonRight);
    }

    canvas.addEventListener(
        "click",
        function (e) {
            const rect = canvas.getBoundingClientRect();
            let mousePositionX = e.clientX - rect.left;
            let mousePositionY = e.clientY - rect.top;

            if (button.isInside(mousePositionX, mousePositionY) === true) {
                inviteKakao();
            }
        },
        false
    );
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    floor.display();
    wallLeft.display();
    wallRight.display();
    button.display();

    floor2.display();
    floor3.display();
    floor4.display();
    floor5.display();

    let doneList = []; // 플레이어 간 충돌 체크 함수가 중복으로 사용되는 것을 막음.

    for (let player in players) {
        for (let player_ in players) {
            if (player != player_ && doneList.includes(player_) === false) {
                physics.useCollisionWithPlayer(
                    players[player],
                    players[player_],
                    flag
                );
            }
        }
        doneList.push(player);

        flag.take(players[player]);

        physics.useMove(players[player], players[player].keyInput);
        physics.usePhysics(players[player]);
        physics.useCollisionWithFloor(players[player], floor);
        physics.useCollisionWithWall(players[player], wallLeft, wallRight);
        physics.useInfinityFall(players[player]);

        physics.useCollisionWithFloor(players[player], floor2);
        physics.useCollisionWithFloor(players[player], floor3);
        physics.useCollisionWithFloor(players[player], floor4);
        physics.useCollisionWithFloor(players[player], floor5);

        physics.useScore(players[player], flag);

        players[player].display();
    }

    flag.display();

    physics.usePhysics(flag);
    physics.useInfinityFall(flag);
    physics.useCollisionWithFloor(flag, floor);
    physics.useCollisionWithFloor(flag, floor2);
    physics.useCollisionWithFloor(flag, floor3);
    physics.useCollisionWithFloor(flag, floor4);
    physics.useCollisionWithFloor(flag, floor5);



    socket.emit("rank", players);
    rank.display(players);
    socket.emit("updatePosition", {
        room: roomId,
        player: players[socket.id],
        flag: flag
    });
}

function keyListener(e) {
    let keyState = false;

    if (e.type === "keydown") {
        keyState = true;
    } else {
        keyState = false;
    }

    switch (e.code) {
        case "ArrowLeft":
            players[socket.id].keyInput.left = keyState;
            break;
        case "ArrowRight":
            players[socket.id].keyInput.right = keyState;
            break;
        case "ArrowUp":
            players[socket.id].keyInput.up = keyState;
            break;
    }
}

function touchButtonLeft(e) {
    let touchState = false;

    if (e.type === "touchstart") {
        touchState = true;
    } else {
        touchState = false;
    }

    players[socket.id].keyInput.left = touchState;
}

function touchButtonRight(e) {
    let touchState = false;

    if (e.type === "touchstart") {
        touchState = true;
    } else {
        touchState = false;
    }

    players[socket.id].keyInput.right = touchState;
}

function touchButtonUp(e) {
    let touchState = false;

    if (e.type === "touchstart") {
        touchState = true;
    } else {
        touchState = false;
    }

    players[socket.id].keyInput.up = touchState;
}

// 접속 기기 체크
function deviceCheck() {
    let pc_device = "win16|win32|win64|mac|macintel";
    let this_device = navigator.platform;
    if (this_device) {
        if (pc_device.indexOf(navigator.platform.toLowerCase()) < 0) {
            return true; //mobile
        } else {
            return false; //pc
        }
    }
}

window.onload = () => {
    setTimeout(() => {
        const nickNameInput = document.querySelector("#nickname");
        const nickNameEnterButton = document.querySelector("#nickname_enter");
        const popup = document.querySelector("#popup_background");
        const mobileKeys = document.querySelector("#keys");
        const loading = document.querySelector("#loading_background");

        if (isMobile) {
            mobileKeys.style.display = "flex";
        }

        socket.on("redirect", () => {
            socket.disconnect();
            const roomCheck = confirm("서버 종료");

            if (roomCheck === true) {
                window.close();
            } else {
                window.close();
            }
        });

        nickNameEnterButton.addEventListener("click", () => {
            nickNameEnterButton.disabled = true;
            loading.style.display = "flex";
            popup.remove();
            setup(nickNameInput.value);
            console.log("loading...");
            setTimeout(() => {
                loading.style.display = "none";
                setInterval(draw, 1000 / 30);
            }, 3000);
        });
    }, 500);
};

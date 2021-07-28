const socket = io();

let width = 0;
let height = 0;

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
let flag;

const physics = new Physics();
const rank = new Rank((WIDTH * 5) / 400, (HEIGHT * 40) / 700, players);
const inviteButton = new Button(
    (WIDTH * 5) / 400,
    (HEIGHT * 5) / 700,
    (WIDTH * 54) / 400,
    (HEIGHT * 30) / 700
);
const readyButton = new Button(
    (WIDTH * 100) / 400,
    (HEIGHT * 5) / 700,
    (WIDTH * 54) / 400,
    (HEIGHT * 30) / 700
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

const floor = new Array(5);

floor[0] = new Platform(
    (WIDTH * 200) / 400,
    (HEIGHT * 670) / 700,
    (WIDTH * 200) / 400,
    (HEIGHT * 40) / 700
);
floor[1] = new Platform(
    (WIDTH * 0) / 400,
    (HEIGHT * 350) / 700,
    (WIDTH * 200) / 400,
    (HEIGHT * 40) / 700
);
floor[2] = new Platform(
    (WIDTH * 200) / 400,
    (HEIGHT * 450) / 700,
    (WIDTH * 100) / 400,
    (HEIGHT * 40) / 700
);
floor[3] = new Platform(
    (WIDTH * 300) / 400,
    (HEIGHT * 250) / 700,
    (WIDTH * 30) / 400,
    (HEIGHT * 40) / 700
);
floor[4] = new Platform(
    (WIDTH * 0) / 400,
    (HEIGHT * 600) / 700,
    (WIDTH * 150) / 400,
    (HEIGHT * 40) / 700
);

function setup(nickName) {
    return new Promise((resolve, reject) => {
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

        socket.on("disconnected", (id) => {
            if (players[id] != undefined && players[id].getFlag === true) {
                flag.drop();
            }
            delete players[id];
        });

        socket.on("start", (data) => {
            for (let id in players) {
                players[id].positionX = (WIDTH * data.player.positionX) / 400;
                players[id].positionY = (HEIGHT * data.player.positionY) / 700;
                players[id].velocityX = 0;
                players[id].velocityY = 0;
                players[id].score = 0;
                players[id].getFlag = false;
            }

            flag.positionX = (WIDTH * data.flag.positionX) / 400;
            flag.positionY = (HEIGHT * data.flag.positionY) / 700;
            flag.velocityX = 0;
            flag.velocityY = 0;
            flag.taken = false;
        });

        socket.on("updatePosition", (data) => {
            players[data.player.id].setState(
                (WIDTH * data.player.positionX) / 400,
                (HEIGHT * data.player.positionY) / 700,
                data.player.getFlag
            );
            flag.setState(
                (WIDTH * data.flag.positionX) / 400,
                (HEIGHT * data.flag.positionY) / 700,
                data.flag.taken
            );
        });

        socket.on("rank", (data) => {
            rank.setRankList(data);
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

        // 버튼 클릭 이벤트
        canvas.addEventListener(
            "click",
            function (e) {
                const rect = canvas.getBoundingClientRect();
                let mousePositionX = e.clientX - rect.left;
                let mousePositionY = e.clientY - rect.top;

                if (
                    inviteButton.isInside(mousePositionX, mousePositionY) ===
                    true
                ) {
                    inviteKakao();
                }

                if (
                    readyButton.isInside(mousePositionX, mousePositionY) ===
                    true
                ) {
                    socket.emit("ready", {
                        roomId: roomId,
                    });
                    console.log("ready click");
                }
            },
            false
        );

        socket.on("generatePlayer", (gameData) => {
            if (flag === undefined) {
                flag = new Flag(
                    gameData.flag.positionX,
                    gameData.flag.positionY,
                    gameData.flag.taken
                );
            }
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
            resolve();
        });
    });
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    wallLeft.display();
    wallRight.display();
    inviteButton.display("친구초대");
    readyButton.display("준비");

    for (let i = 0; i < floor.length; i++) {
        floor[i].display();
    }

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
        physics.useScore(players[player], flag);
        physics.useCollisionWithWall(players[player], wallLeft, wallRight);
        physics.useInfinityFall(players[player]);
        physics.useInfinityFall(flag);
        for (let i = 0; i < floor.length; i++) {
            physics.useCollisionWithFloor(players[player], floor[i]);
        }

        players[player].display();
    }

    flag.dropCheck(players);
    flag.display();

    physics.usePhysics(flag);
    physics.useInfinityFall(flag);
    for (let i = 0; i < floor.length; i++) {
        physics.useCollisionWithFloor(flag, floor[i]);
    }

    rank.display();
    socket.emit("updatePosition", {
        room: roomId,
        player: players[socket.id],
        flag: flag,
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
        setup(nickNameInput.value)
            .then(() => {
                loading.style.display = "none";
                setInterval(draw, 1000 / 30);
            })
            .catch((error) => {
                socket.disconnect();
                const roomCheck = confirm(error);

                if (roomCheck === true) {
                    window.close();
                } else {
                    window.close();
                }
            });
    });
};

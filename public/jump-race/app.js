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
const platform = new Platform();
const physics = new Physics();
const button = new Button(
    (WIDTH * 5) / 400,
    (HEIGHT * 5) / 700,
    (WIDTH * 54) / 400,
    (HEIGHT * 30) / 700
);

const floor = new Platform(
    (WIDTH * 150) / 400,
    (HEIGHT * 650) / 700,
    (WIDTH * 100) / 400,
    (HEIGHT * 50) / 700
);

const wallLeft = new Platform(
    (HEIGHT * -20) / 700,
    (HEIGHT * 0) / 700,
    (HEIGHT * 20) / 700,
    (HEIGHT * 700) / 700
);

const wallRight = new Platform(
    (HEIGHT * 400) / 700,
    (HEIGHT * 0) / 700,
    (HEIGHT * 20) / 700,
    (HEIGHT * 700) / 700
);

function setup(nickName) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const url = new URL(window.location.href);
    const urlParams = url.searchParams;

    if (urlParams.has("room")) {
        socket.emit("joinRoom", {
            roomId: urlParams.get("room"),
            nickName: nickName,
        });
        roomId = urlParams.get("room");
    } else {
        socket.emit("GenerateRoom", nickName);
        roomId = socket.id + "_room";
        const link =
            "http://ec2-3-35-14-224.ap-northeast-2.compute.amazonaws.com/jump-race/?room=" +
            roomId;
        console.log(link);
    }

    socket.on("generatePlayer", (gameData) => {
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
    });

    socket.on("disconnected", (id) => {
        delete players[id];
    });

    socket.on("updatePosition", (player) => {
        players[player.id].setPosition(
            (WIDTH * player.positionX) / 400,
            (HEIGHT * player.positionY) / 700
        );
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

    for (let player in players) {
        physics.useMove(players[player], players[player].keyInput);
        physics.usePhysics(players[player]);
        physics.useCollisionWithFloor(players[player], floor);
        physics.useCollisionWithWall(players[player], wallLeft, wallRight);
        physics.useInfinityFall(players[player]);

        players[player].display();
    }

    socket.emit("updatePosition", { room: roomId, player: players[socket.id] });
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
    // console.log('left');
}

function touchButtonRight(e) {
    let touchState = false;

    if (e.type === "touchstart") {
        touchState = true;
    } else {
        touchState = false;
    }

    players[socket.id].keyInput.right = touchState;
    // console.log('right');
}

function touchButtonUp(e) {
    let touchState = false;

    if (e.type === "touchstart") {
        touchState = true;
    } else {
        touchState = false;
    }

    players[socket.id].keyInput.up = touchState;
    // console.log('up');
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

        if (isMobile) {
            mobileKeys.style.display = "flex";
        }

        socket.on("redirect", () => {
            const roomCheck = confirm(
                "해당하는 방이 없습니다! 새로운 방을 만들까요?"
            );
            if (roomCheck === true) {
                window.location.href = "./";
            } else {
                window.close();
            }
        });

        nickNameEnterButton.addEventListener("click", () => {
            popup.remove();
            setup(nickNameInput.value);
            setInterval(draw, 1000 / 30);
        });
    }, 1000);
};

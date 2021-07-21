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

const floor = new Platform(
    (HEIGHT * 0) / 700,
    (HEIGHT * 700) / 700,
    (HEIGHT * 400) / 700,
    (HEIGHT * 300) / 700
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
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let player in players) {
        physics.useMove(players[player], players[player].keyInput);
        physics.usePhysics(players[player]);
        physics.useCollisionWithFloor(players[player], floor);
        physics.useCollisionWithWall(players[player], wallLeft, wallRight);

        players[player].display();
    }

    socket.emit("updatePosition", { room: roomId, player: players[socket.id] });

    floor.display();
    wallLeft.display();
    wallRight.display();
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

window.onload = () => {
    setTimeout(() => {
        const nickNameInput = document.querySelector("#nickname");
        const nickNameEnterButton = document.querySelector("#nickname_enter");
        const popup = document.querySelector("#popup_background");

        socket.on("redirect", () => {
            const roomCheck = confirm('해당하는 방이 없습니다! 새로운 방을 만들까요?');
            if (roomCheck === true){
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

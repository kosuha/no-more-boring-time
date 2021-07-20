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

function setup() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const url = new URL(window.location.href);
    const urlParams = url.searchParams;

    if (urlParams.has("room")) {
        socket.emit("joinRoom", { id: urlParams.get("room") });
        roomId = urlParams.get("room");
    } else {
        socket.emit("GenerateRoom");
        roomId = socket.id + "_room";
    }

    socket.on("generatePlayer", (gameData) => {
        const members = gameData.roomData.members;
        for (let member in members) {
            if (member in players === false) {
                players[member] = new Player(
                    member,
                    members[member].positionX,
                    members[member].positionY,
                    members[member].color
                );
            }
        }
        console.log(players);
    });

    window.addEventListener("keydown", function (e) {
        socket.emit("keyInput", {
            player: socket.id,
            room: roomId,
            input: e.code,
        });
    });

    window.addEventListener("keyup", function (e) {
        socket.emit("turn", { player: socket.id, room: roomId });
    });

    socket.on("update", (player) => {
        console.log("update", player);
        players[player.id].updatePosition(player.positionX, player.positionY);
    });
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    for (let player in players) {
        // console.log(players[player]);
        players[player].display();
    }
}

window.onload = () => {
    setTimeout(() => {
        setup();
        setInterval(draw, 10);
    }, 100);
};

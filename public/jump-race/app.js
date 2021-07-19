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
let players = [];

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
        player = new Player(gameData.player)
        players[gameData.player] = player;
    });

    window.addEventListener("keydown", function (e) {
        switch (e.code) {
            case "ArrowUp":
                socket.emit("jump", { player: socket.id, room: roomId });
                break;
            case "ArrowLeft":
                socket.emit("left", { player: socket.id, room: roomId });
                break;
            case "ArrowRight":
                socket.emit("right", { player: socket.id, room: roomId });
                break;
            default:
                break;
        }
    });

    window.addEventListener("keyup", function (e) {
        socket.emit("turn", { player: socket.id, room: roomId });
    });

}

function draw() {
    socket.on('left', (player) => {
        console.log('left');
    });
    socket.on('right', (player) => {
        console.log('right');
    });
    socket.on('jump', (player) => {
        console.log('jump');
    });
    socket.on('turn', (player) => {
        console.log('turn');
    });

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(200,0,0)";
    ctx.fillRect(10, 10, 50, 50);

    ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
    ctx.fillRect(30, 30, 50, 50);

}

class Player {
    constructor(id) {
        this.id = id;
        this.nickName = 'testnick';
    }

    getId(){
        return this.id;
    }

    getNickName() {
        return this.nickName;
    }
}

window.onload = () => {
    setup();
    setInterval(draw, 100);
}


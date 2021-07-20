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

function setup(nickName) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    const url = new URL(window.location.href);
    const urlParams = url.searchParams;

    if (urlParams.has("room")) {
        socket.emit("joinRoom", { roomId: urlParams.get("room"), nickName: nickName });
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
        // console.log(players);
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

    socket.on("update", (room) => {
        // console.log("update", player);
        for(let member in room.members){
            let player = room.members[member];
            players[player.id].updatePosition(player.positionX, player.positionY);
        }
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

    platform.display(HEIGHT*0/700, HEIGHT*690/700, HEIGHT*400/700, HEIGHT*10/700);
    platform.display(HEIGHT*0/700, HEIGHT*0/700, HEIGHT*10/700, HEIGHT*700/700);
    platform.display(HEIGHT*390/700, HEIGHT*0/700, HEIGHT*10/700, HEIGHT*700/700);
}

window.onload = () => {
    setTimeout(() => {
        const nickNameInput = document.querySelector("#nickname");
        const nickNameEnterButton = document.querySelector("#nickname_enter");
        const popup = document.querySelector("#popup_background");

        nickNameEnterButton.addEventListener("click", () => {
            popup.remove();
            
            setup(nickNameInput.value);
            setInterval(draw, 1);
        });
    }, 1000);
};

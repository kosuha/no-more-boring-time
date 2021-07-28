const socket = io();

let width = 0;
let height = 0;

// 창 크기에 맞게 사이즈 조절
if (window.innerWidth / window.innerHeight > 400 / 700) {
    width = (window.innerHeight * 400) / 700;
    height = window.innerHeight;
} else {
    width = window.innerWidth;
    height = (window.innerWidth * 700) / 400;
}

// // 모바일 환경 체크 
// const isMobile = deviceCheck();

// canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// 가로 세로 사이즈를 상수로 선언
canvas.width = width;
canvas.height = height;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const roomData = {
    roomId: undefined, // 방 ID
    players: {}, // 접속 중인 플레이어 목록
    flag: undefined // 깃발 Class가 담길 변수
};

// 물리엔진
const physics = new Physics();

// 랭크
const rank = new Rank((WIDTH * 5) / 400, (HEIGHT * 40) / 700, roomData.players);

// 버튼
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

// 벽
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

// 바닥
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
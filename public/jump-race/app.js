function setup(nickName) {
    return new Promise((resolve, reject) => {
        // canvas 초기화
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = "rgb(255, 255, 255)";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        // 초대 받은 url 인지 체크 (파라미터 검색)
        const url = new URL(window.location.href);
        const urlParams = url.searchParams;
        if (urlParams.has("room")) {
            roomData.roomId = urlParams.get("room");
        } else {
            roomData.roomId = socket.id + "_room";
        }

        // 접속 시 서버에 알림
        socket.emit("joinRoom", {
            roomId: roomData.roomId,
            nickName: nickName,
        });

        // 접속 종료, 객체 제거
        socket.on("disconnected", (id) => {
            if (
                roomData.players[id] != undefined &&
                roomData.players[id].getFlag === true
            ) {
                roomData.flag.drop();
            }
            delete roomData.players[id];
        });

        // 시작 신호 받음
        socket.on("start", (data) => {
            console.log(data.inGamePlayers);
            for (let id in data.inGamePlayers) {
                roomData.players[id].waiting = false;
                roomData.players[id].score = 0;
                roomData.players[id].getFlag = false;
            }

            roomData.flag.positionX = (WIDTH * data.flag.positionX) / 400;
            roomData.flag.positionY = (HEIGHT * data.flag.positionY) / 700;
            roomData.flag.velocityX = 0;
            roomData.flag.velocityY = 0;
            roomData.flag.taken = false;

            roomData.gameStart = true;
        });

        // 서버에서 상태 업데이트 데이터 받음
        socket.on("updatePosition", (data) => {
            console.log(data.player.waiting);
            roomData.players[data.player.id].setState(
                (WIDTH * data.player.positionX) / 400,
                (HEIGHT * data.player.positionY) / 700,
                data.player.getFlag,
                data.player.waiting
            );
            roomData.flag.setState(
                (WIDTH * data.flag.positionX) / 400,
                (HEIGHT * data.flag.positionY) / 700,
                data.flag.taken
            );
            roomData.gameStart = data.gameStart;
        });

        // 서버에서 랭크 업데이트 데이터 받음
        socket.on("rank", (data) => {
            rank.setRankList(data);
        });

        // 서버에서 승자 알림받음
        socket.on("win", (winner) => {
            console.log(winner);
            for (let id in roomData.players) {
                roomData.players[id].score = 0;
                roomData.players[id].waiting = true;
                roomData.players[id].getFlag = false;
                readyButton.use = true;
            }
        });

        // key 이벤트
        window.addEventListener("keydown", keyListener);
        window.addEventListener("keyup", keyListener);

        // 모바일 터치 이벤트
        if (deviceCheck() === true) {
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
                    readyButton.use === true &&
                    readyButton.isInside(mousePositionX, mousePositionY) ===
                        true
                ) {
                    readyButton.use = false;
                    socket.emit("ready", {
                        roomId: roomData.roomId,
                    });
                    console.log("ready click");
                }
            },
            false
        );

        // 서버에서 새로 생성할 객체 정보 받아서 생성
        socket.on("generatePlayer", (gameData) => {
            // 깃발 객체가 없다면 생성
            if (roomData.flag === undefined) {
                roomData.flag = new Flag(
                    gameData.flag.positionX,
                    gameData.flag.positionY,
                    gameData.flag.taken
                );
            }
            const members = gameData.roomData.members;
            for (let member in members) {
                // 플레이어 목록에 없는 플레이어라면 생성
                if (member in roomData.players === false) {
                    roomData.players[member] = new Player(
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

            // promise (draw 함수가 실행 되기 전에 setup이 완료 되어야 함)
            resolve();
        });
    });
}

function draw() {
    // canvas 초기화
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // canvas에 벽 생성
    wallLeft.display();
    wallRight.display();

    // canvas에 버튼 생성
    inviteButton.display();
    readyButton.setText()
    readyButton.display();

    // canvas에 바닥 생성
    for (let i = 0; i < floor.length; i++) {
        floor[i].display();
    }

    let doneList = []; // 플레이어 간 충돌 체크 함수가 중복으로 사용되는 것을 막음.

    for (let player in roomData.players) {
        for (let player_ in roomData.players) {
            if (player != player_ && doneList.includes(player_) === false) {
                // 인게임 플레이어 충돌 적용
                console.log("collision!");
                physics.useCollisionWithPlayer(
                    roomData.players[player],
                    roomData.players[player_],
                    roomData.flag
                );
            }
        }
        doneList.push(player);

        // 깃발 획득 적용
        roomData.flag.take(roomData.players[player]);

        // 플레이어 가속도, 중력 적용
        physics.useMove(
            roomData.players[player],
            roomData.players[player].keyInput
        );
        physics.usePhysics(roomData.players[player]);

        // 깃발 획득 시 점수 증가
        physics.useScore(roomData.players[player], roomData.flag);

        // 벽 충돌 적용
        physics.useCollisionWithWall(
            roomData.players[player],
            wallLeft,
            wallRight
        );

        // 플레이어와 깃발에 무한 낙하 적용
        physics.useInfinityFall(roomData.players[player]);
        physics.useInfinityFall(roomData.flag);

        // 플레이어 바닥 충돌 적용
        for (let i = 0; i < floor.length; i++) {
            physics.useCollisionWithFloor(roomData.players[player], floor[i]);
        }

        // canvas에 플레이어 생성
        roomData.players[player].display();
    }

    // 깃발이 소유된 상태인지 재확인
    roomData.flag.dropCheck(roomData.players);

    // canvas에 깃발 생성
    roomData.flag.display();

    // 깃발에 가속도, 중력 적용
    physics.usePhysics(roomData.flag);

    // 깃발 바닥 충돌 적용
    for (let i = 0; i < floor.length; i++) {
        physics.useCollisionWithFloor(roomData.flag, floor[i]);
    }

    // 랭크
    rank.display();

    // 서버로 업데이트 데이터 보냄
    socket.emit("updatePosition", {
        room: roomData.roomId,
        player: roomData.players[socket.id],
        flag: roomData.flag,
    });
}

// key input을 변수에 저장
function keyListener(e) {
    let keyState = false;

    if (e.type === "keydown") {
        keyState = true;
    } else {
        keyState = false;
    }

    switch (e.code) {
        case "ArrowLeft":
            roomData.players[socket.id].keyInput.left = keyState;
            break;
        case "ArrowRight":
            roomData.players[socket.id].keyInput.right = keyState;
            break;
        case "ArrowUp":
            roomData.players[socket.id].keyInput.up = keyState;
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

    roomData.players[socket.id].keyInput.left = touchState;
}

function touchButtonRight(e) {
    let touchState = false;

    if (e.type === "touchstart") {
        touchState = true;
    } else {
        touchState = false;
    }

    roomData.players[socket.id].keyInput.right = touchState;
}

function touchButtonUp(e) {
    let touchState = false;

    if (e.type === "touchstart") {
        touchState = true;
    } else {
        touchState = false;
    }

    roomData.players[socket.id].keyInput.up = touchState;
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

    // 모바일 환경에서 터치 버튼 활성화
    if (deviceCheck()) {
        mobileKeys.style.display = "flex";
    }

    // 서버 에러 발생 시 처리
    socket.on("redirect", () => {
        socket.disconnect();
        const roomCheck = confirm("서버 종료");

        if (roomCheck === true) {
            window.close();
        } else {
            window.close();
        }
    });

    // 닉네임 입력 버튼 이벤트
    nickNameEnterButton.addEventListener("click", () => {
        nickNameEnterButton.disabled = true;
        loading.style.display = "flex";
        popup.remove();
        setup(nickNameInput.value)
            .then(() => {
                loading.style.display = "none";

                // 30 프레임 loop
                setInterval(draw, 1000 / 30);
            })
            .catch((error) => {
                // 서버 에러 발생 시 처리
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

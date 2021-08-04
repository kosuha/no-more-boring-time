class Physics {
    constructor() {
        this.gravity = (WIDTH * 3) / 400;
        this.friction = 0.85;
        this.velocityX = (WIDTH * 1) / 400;
        this.jumpPower = (HEIGHT * 50) / 700;
    }

    // 가속도, 중력
    usePhysics(player) {
        player.velocityY += this.gravity; // gravity
        player.positionX += player.velocityX;
        player.positionY += player.velocityY;
        player.velocityX *= this.friction; // friction
        player.velocityY *= this.friction;
    }

    // 플레이어 움직임
    useMove(player, keyInput) {
        if (keyInput.up && player.jumping === false && player.velocityY === 0) {
            player.velocityY -= this.jumpPower;
            player.jumping = true;
        }

        if (keyInput.left) {
            player.velocityX -= this.velocityX;
        }

        if (keyInput.right) {
            player.velocityX += this.velocityX;
        }
    }

    // 맵 위 아래 연결
    useInfinityFall(player) {
        if (player.positionY < -player.height) {
            player.positionY = (HEIGHT * 700) / 700;
        } else if (player.positionY > (HEIGHT * 700) / 700) {
            player.positionY = -player.height;
        }
    }

    // 플레이어간 충돌
    useCollisionWithPlayer(a, b, flag) {
        if (a.waiting === false && b.waiting === false) {
            const dist = this.distance(a, b);
            const power = a.width - dist;
    
            if (this.distance(a, b) < a.width) {
                a.getFlag = false;
                b.getFlag = false;
                flag.drop();
    
                if (a.positionX > b.positionX) {
                    a.velocityX += (HEIGHT * power * 2) / 700;
                    b.velocityX -= (HEIGHT * power * 2) / 700;
                } else if (a.positionX < b.positionX) {
                    a.velocityX -= (HEIGHT * power * 2) / 700;
                    b.velocityX += (HEIGHT * power * 2) / 700;
                }
    
                if (a.positionY < b.positionY) {
                    a.velocityY -= (HEIGHT * power * 2) / 700;
                    b.velocityY += (HEIGHT * power * 2) / 700;
                } else if (a.positionY > b.positionY) {
                    a.velocityY += (HEIGHT * power * 2) / 700;
                    b.velocityY -= (HEIGHT * power * 2) / 700;
                }
            }
        }
    }

    // 점수 계산
    useScore(player, flag) {
        if (player.waiting === false) {
            const dist = this.distance(player, flag);

            if (dist < player.width / 2 && player.getFlag === false && flag.taken == false && flag.velocityY === 0) {
                player.getFlag = true;
                flag.taken = true;
            }
    
            if (player.getFlag === true) {
                player.score += 1;
            }
        }
    }

    // 벽 충돌
    useCollisionWithWall(player, leftWall, rightWall) {
        if (player.positionX < leftWall.positionX + leftWall.width) {
            player.positionX = leftWall.positionX + leftWall.width;
        }

        if (player.positionX + player.width > rightWall.positionX) {
            player.positionX = rightWall.positionX - player.width;
        }
    }

    // 바닥 충돌
    useCollisionWithFloor(player, floor) {
        if (
            floor.positionY < player.positionY + player.height &&
            player.positionY + player.height < floor.positionY + floor.height / 2 &&
            player.positionX + player.width > floor.positionX &&
            player.positionX < floor.positionX + floor.width &&
            player.velocityY >= 0
        ) {
            player.positionY = floor.positionY - player.height - 1;
            player.jumping = false;
            player.velocityY = 0;
        }
    }

    // 객체 사이의 거리 계산
    distance(a, b) {
        const x = a.positionX - b.positionX;
        const y = a.positionY - b.positionY;
        return Math.sqrt((x * x) + (y * y));
    }
}

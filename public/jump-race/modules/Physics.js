class Physics {
    constructor() {
        this.gravity = (WIDTH * 3) / 400;
        this.friction = 0.85;
        this.velocityX = (WIDTH * 1) / 400;
        this.jumpPower = (HEIGHT * 50) / 700;
    }

    usePhysics(player) {
        player.velocityY += this.gravity; // gravity
        player.positionX += player.velocityX;
        player.positionY += player.velocityY;
        player.velocityX *= this.friction; // friction
        player.velocityY *= this.friction;
    }

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

    useGravity(player) {
        player.positionY += this.gravity;
    }

    useInfinityFall(player) {
        if (player.positionY < -player.height) {
            player.positionY = (HEIGHT * 700) / 700;
        } else if (player.positionY > (HEIGHT * 700) / 700) {
            player.positionY = -player.height;
        }
    }

    useCollisionWithPlayer(a, b, flag) {
        const dist = this.distance(a, b);
        const power = a.width - dist;

        if (this.distance(a, b) < a.width) {
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

            a.getFlag = false;
            b.getFlag = false;
            flag.drop();

        }
    }

    useScore(player, flag) {
        const dist = this.distance(player, flag);

        if (dist < player.width / 2 && player.getFlag === false && flag.taken == false && flag.velocityY >= 0) {
            player.getFlag = true;
            flag.taken = true;
        }

        if (player.getFlag === true) {
            player.score += 1;
        }
    }

    useCollisionWithWall(player, leftWall, rightWall) {
        if (player.positionX < leftWall.positionX + leftWall.width) {
            player.positionX = leftWall.positionX + leftWall.width;
        }

        if (player.positionX + player.width > rightWall.positionX) {
            player.positionX = rightWall.positionX - player.width;
        }
    }

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

    distance(a, b) {
        const x = a.positionX - b.positionX;
        const y = a.positionY - b.positionY;
        return Math.sqrt((x * x) + (y * y));
    }
}

class Physics {
    constructor() {
        this.gravity = (WIDTH * 1.5) / 400;
        this.friction = 0.9;
        this.velocityX = (WIDTH * 1) / 400;
        this.jumpPower = (HEIGHT * 30) / 700;
    }

    usePhysics(player) {
        player.velocityY += this.gravity; // gravity
        player.positionX += player.velocityX;
        player.positionY += player.velocityY;
        player.velocityX *= this.friction; // friction
        player.velocityY *= this.friction;
    }

    useMove(player, keyInput) {
        if (keyInput.up && player.jumping === false) {
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

    useCollisionWithPlayer(a, b) {}

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
            player.positionY + player.height <
                floor.positionY + floor.height / 2 &&
            player.positionX + player.width > floor.positionX &&
            player.positionX < floor.positionX + floor.width
        ) {
            player.positionY = floor.positionY - player.height - 1;
            player.jumping = false;
            player.velocityY = 0;
        }

        if (
            floor.positionY + floor.height / 2 < player.positionY &&
            player.positionY < floor.positionY + floor.height &&
            player.positionX + player.width > floor.positionX &&
            player.positionX < floor.positionX + floor.width
        ) {
            player.positionY = floor.positionY + floor.height + 1;
        }

        if (
            floor.positionX < player.positionX + player.width &&
            player.positionX + player.width <
                floor.positionX + floor.width / 2 &&
            player.positionY + player.height > floor.positionY &&
            player.positionY < floor.positionY + floor.height
        ) {
            player.positionX = floor.positionX - player.width - 1;
        }

        if (
            floor.positionX + floor.width / 2 < player.positionX &&
            player.positionX < floor.positionX + floor.width &&
            player.positionY + player.height > floor.positionY &&
            player.positionY < floor.positionY + floor.height
        ) {
            player.positionX = floor.positionX + floor.width + 1;
        }
    }
}

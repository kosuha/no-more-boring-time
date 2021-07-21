class Physics {
    constructor(){
        this.gravity = (WIDTH * 10) / 400;;
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
            player.positionY + player.height < floor.positionY + floor.height / 2 &&
            player.positionX + player.width > floor.positionX &&
            player.positionX < floor.positionX + floor.width
        ) {
            player.positionY = floor.positionY - player.height - 1;
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
            player.positionX + player.width < floor.positionX + floor.width / 2 &&
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
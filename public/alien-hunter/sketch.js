let strkWeight;
let shootValue = false;
let oEyeNum = 5;
let page = 0;
let stage = 1;
let finalStage = 20;
let gold = 100;
let buttonNum = 3;
let fireNum = 0;
let hitNum = 0;
let accuracy = 0;
let title_1;
let title_2;
let ship;
let title;
let openingSoundOn = false;

let gun;
let oEye = [];
let titleOEye = [];
let bullet;
let button = [];
let star = [];

// let canvasWidth;
// let canvasHeight;

function preload() {
    title_1 = loadImage("assets/title_1.png");
    title_2 = loadImage("assets/title_2.png");
    ship = loadImage("assets/ship.png");

    opening = loadSound("assets/opening.mp3");
    deadEffect = loadSound("assets/dead.mp3");
    shotEffect = loadSound("assets/shot.mp3");
    clickEffect = loadSound("assets/click.mp3");
}

function setup() {
    // if(window.innerWidth > window.innerHeight) {
    //     canvasWidth = window.innerHeight * (2 / 3);
    //     canvasHeight = window.innerHeight * (2 / 3);
    // } else {
    //     canvasWidth = window.innerWidth * (2 / 3);
    //     canvasHeight = window.innerWidth * (2 / 3);
    // }

    let cnv = createCanvas(500, 500);
    cnv.parent('sketch-holder'); //스케치가 '#sketch-holder'에 들어갑니다.

    opening.setVolume(0.1);
    deadEffect.setVolume(0.1);
    shotEffect.setVolume(0.1);
    clickEffect.setVolume(0.1);

    ship.resize(50, 0);

    for (let i = 0; i < oEyeNum; i++) {
        oEye[i] = new oEyeClass(0.1, parseInt(random(0, width)), 50 + (i * (height - (2 * height / 3)) / 5));
    }
    for (let i = 0; i < 15; i++) {
        titleOEye[i] = new oEyeClass(0.1, parseInt(random(0, width)), 50 + (i * (height - (2 * height / 3)) / 5));
    }

    button[0] = new buttonClass(300, width / 2, 200, "Bullet Speed Up");
    button[1] = new buttonClass(500, width / 2, 300, "Laser Poleter");
    button[2] = new buttonClass(200, width / 2, 400, "Spaceship Speed Up");

    for (let i = 0; i < 100; i++) {
        star[i] = new starClass();
    }

    gun = new gunClass();
    bullet = new bulletClass();
}

function draw() {
    background(0);

    for (let i = 0; i < 100; i++) {
        star[i].display();
    }

    switch (page) {
        case 0:
            for (let i = 0; i < oEyeNum; i++) {
                oEye[i].deadman = false;
                oEye[i].basic();
                oEye[i].posX = parseInt(random(0, width));
            }

            bullet.speedLevel = 0;
            button[1].laserOn = false;
            gun.speed = 2;
            fireNum = 0;
            hitNum = 0;
            gold = 100;
            stage = 1;
            gun.posX = width / 2;

            for (let i = 0; i < oEyeNum; i++) {
                oEye[i].speedX = 1;
                oEye[i].speedY = 1;
                oEye[i].scaleVal = 0.1;
            }
            for (let i = 0; i < 15; i++) {
                titleOEye[i].speedX = 2;
                titleOEye[i].speedY = 2;
                titleOEye[i].scaleVal = 0.05;
                titleOEye[i].move2();
                titleOEye[i].display();
            }

            imageMode(CENTER);
            title = title + 1;
            if (title < 13) {
                image(title_1, width / 2, height / 2 - 50);
            } else {
                image(title_2, width / 2, height / 2 - 50);
                if (title >= 25) {
                    title = 0;
                }
            }

            fill(255);
            textAlign(CENTER);
            text("Press 'ENTER' to start game.", width / 2, height / 2 + 100);

            if (keyIsPressed) {
                if (keyCode === 13) {
                    page = 1;
                }
            }
            if (openingSoundOn === false) {
                opening.loop();
                opening.jump(0.1);
                openingSoundOn = true;
            }

            break;

        case 1:
            if (openingSoundOn === true) {
                opening.pause();
                openingSoundOn = false;
            }

            if (stage === finalStage && oEye[0].deadman && oEye[1].deadman && oEye[2].deadman && oEye[3].deadman && oEye[4].deadman) {
                page = 3;
            }

            stages();

            if (gold < 0) {
                page = 3;
                bullet.posY = -100;
            }
            if (fireNum >= 1) {
                accuracy = (hitNum / fireNum) * 100;
            }
            textAlign(LEFT);
            fill(255);
            text("Stage " + stage, 50, 50);
            text("Gold: " + gold, 50, 70);
            text("Accuracy: " + round(accuracy) + "%", 50, 90);
            break;

        case 2:
            fill(255);
            textAlign(LEFT);
            text("Next: stage " + (stage + 1), 50, 50);
            text("Gold: " + gold, 50, 70);
            text("Accuracy: " + round(accuracy) + "%", 50, 90);
            textAlign(CENTER);
            text("Going to next stage: 'ENTER'", 5 * width / 8 + 20, 70);
            shop();

            if (keyIsPressed) {
                if (keyCode === 13) {
                    bullet.posY = -100;
                    gold = gold + 100;
                    page = 1;
                    stage = stage + 1;
                    for (let i = 0; i < oEyeNum; i++) {
                        oEye[i].deadman = false;
                        oEye[i].posX = parseInt(random(0, width));
                        oEye[i].basic();
                        oEye[i].speedX = oEye[i].speedX * 1.1;
                        oEye[i].speedY = oEye[i].speedY * 1.1;
                        oEye[i].scaleVal = oEye[i].scaleVal * 0.9;
                    }
                }
            }
            break;

        case 3:
            fill(255);
            textAlign(CENTER);
            text("< Your Record >", width / 2, height / 2 - 100);
            if (stage === finalStage + 1) {
                stage = stage - 1;
            }
            text("Stage: " + stage + "/20", width / 2, height / 2 - 80);
            if (gold === -10) {
                gold = 0;
            }
            text("Gold: " + gold, width / 2, height / 2 - 60);
            text("Hit: " + parseInt(hitNum), width / 2, height / 2 - 40);
            text("Fire: " + parseInt(fireNum), width / 2, height / 2 - 20);
            text("Accuracy: " + round(accuracy) + "%", width / 2, height / 2);
            text("Click to start new game.", width / 2, height / 2 + 60);
            if (mouseIsPressed) {
                page = 0;
            }
            break;
    }
}

function stages() {
    bullet.bulletBuy = bullet.bulletCost;
    for (let j = 1; j < finalStage + 1; j++) {
        if (stage === j) {
            for (let i = 0; i < oEyeNum; i++) {
                oEye[i].move();
                oEye[i].display();
                oEye[i].checkOn();
            }
            bullet.display();
            gun.userControl();
            gun.display();
            bullet.shoot();
        }
    }

    if (stage < finalStage && oEye[0].deadman && oEye[1].deadman && oEye[2].deadman && oEye[3].deadman && oEye[4].deadman) {
        page = 2;
    }
}

function shop() {
    textAlign(CENTER);
    bullet.bulletBuy = 0;
    bullet.display();
    gun.userControl();
    gun.display();

    for (let i = 0; i < buttonNum; i++) {
        button[i].display();
    }
    bullet.shoot();

    if (button[1].laserOn) {
        button[1].cost = 0;
        button[1].buttonColor = color(200);
        button[1].textColor = color(200);
    }
}

function mouseClicked() {
    for (let i = 0; i < buttonNum; i++) {
        if (button[i].posX - 115 < mouseX && mouseX < button[i].posX + 115 && button[i].posY - 25 < mouseY && mouseY < button[i].posY + 25) {
            if (gold >= button[i].cost) {
                button[i].buttonOnOff = true;
            }
        }
    }
}

class bulletClass {
    constructor() {
        this.posX = -100;
        this.posY = -100;
        this.bulletColor = color(0, 255, 0);
        this.bulletColor2 = color('rgba(0, 255, 0, 0.50)');
        this.bulletCost = 10;
        this.bulletBuy = this.bulletCost;
        this.speedLevel = 0;
        this.airResistance = 0.993;
        this.speed;
        this.acceleration;
        this.bulletX;
        this.returnX;
    }

    display() {
        noStroke();
        fill(this.bulletColor);
        ellipse(this.posX, this.posY, width * 3 / 600, height * 3 / 600);
        fill(this.bulletColor2);
        ellipse(this.posX, this.posY, width * 10 / 600, height * 10 / 600);
    }

    shoot() {
        if (keyIsPressed && 0 <= this.posX && this.posX <= width) {
            if (keyCode === 65) {
                this.returnX = this.returnX - 2;
            }
            if (keyCode === 68) {
                this.returnX = this.returnX + 2;
            }
        }

        if (keyIsPressed) {
            if (keyCode === 87 && shootValue === false) {
                this.posY = gun.posY;
                this.bulletX = gun.posX;
                gold = gold - this.bulletBuy;
                this.speed = 6 + this.speedLevel;
                this.acceleration = this.speed;
                shotEffect.jump(0.7);
                if (page === 1) {
                    fireNum = fireNum + 1;
                }
                shootValue = true;
            }
        }

        if (shootValue) {
            this.acceleration = this.acceleration * this.airResistance;
            this.posY = this.posY - this.acceleration;
            this.posX = this.bulletX;
            if (this.posY <= 0) {
                this.posY = gun.posY;
                this.posX = -100;
                this.acceleration = this.speed;
                shootValue = false;
            }
        }

        if (button[0].bulletSpeedUpValue) {
            this.speedLevel = this.speedLevel + 1;
            button[0].bulletSpeedUpValue = false;
        }
    }
}

class buttonClass {
    constructor(forCost, forPosX, forPosY, forName) {
        this.cost = forCost;
        this.posX = forPosX;
        this.posY = forPosY;
        this.name = forName;
        this.buttonColor = color(0);
        this.textColor = color(0);
        this.buttonOnOff;
        this.laserOn;
        this.bulletSpeedUpValue;
        this.gunSpeedUpValue;
    }

    display() {
        rectMode(CENTER);
        fill(255);
        strokeWeight(1);
        stroke(this.buttonColor);
        rect(this.posX, this.posY, 230, 50, 10);

        if (this.posX - 115 < mouseX && mouseX < this.posX + 115 && this.posY - 25 < mouseY && mouseY < this.posY + 25) {
            if (gold >= this.cost) {
                this.buttonColor = color(0, 200, 0);
                this.textColor = color(0, 200, 0);
            } else {
                this.buttonColor = color(200, 0, 0);
                this.textColor = color(200, 0, 0);
            }
        } else {
            this.buttonColor = color(0);
            this.textColor = color(0);
        }

        if (this.buttonOnOff) {
            gold = gold - this.cost;
            this.bulletSpeedUpValue = true;
            this.gunSpeedUpValue = true;
            this.laserOn = true;
            clickEffect.jump(0.8);
            this.buttonOnOff = false;
        }

        fill(this.textColor);
        text(this.name, this.posX, this.posY - 5);
        text(this.cost + " Gold", this.posX, this.posY + 15);
    }
}

class oEyeClass {
    constructor(forScaleVal, forPosX, forPosY) {
        this.hairColor = color(255, 255, 0);
        this.strkColor = color(0);
        this.scaleVal = forScaleVal;
        this.posX = forPosX;
        this.posY = forPosY;
        this.pupil1SizeX = width * 100 / 300;
        this.pupil1SizeY = height * 100 / 300;
        this.pupil2SizeX = width * 50 / 300;
        this.pupil2SizeY = height * 50 / 300;
        this.speedX = 1;
        this.speedY = 1;
        this.deadEffectTime = 0;
        this.distance;
        this.x = parseInt(random(0, 2000));
        this.deadman;
        this.dead;
        this.deadPosX;
        this.deadPosY;
    }

    display() {

        if (this.x >= 0) {
            this.x = this.x + 1;
            if (this.x >= 20000) {
                this.x = 0;
            }
        }

        push();
        translate(this.posX, this.posY);
        rotate(map(this.x, 0, 1000, 0, 2 * PI));
        scale(this.scaleVal);
        translate(-width / 2, -height / 2);
        rectMode(CENTER);
        stroke(0);
        strokeWeight(width / 60);

        //sclera
        fill(255);
        noStroke();
        arc(width * 150 / 300, height * 130 / 300, width * 200 / 300, height * 200 / 300, 0 - (0.15 * PI), PI + (0.15 * PI), CHORD);

        //pupil
        fill(this.hairColor);
        ellipse(width * 180 / 300, height * 155 / 300, this.pupil1SizeX, this.pupil1SizeY);
        fill(0);
        ellipse(width * 188 / 300, height * 155 / 300, this.pupil2SizeX, this.pupil2SizeY);

        //eyebrow
        fill(this.hairColor);
        rect(width * 150 / 300, height * 85 / 300, width * 240 / 300, height * 30 / 300, width * 20 / 300);

        if (this.deadman) {
            this.posX = this.deadPosX;
            this.posY = this.deadPosY;
            this.deadEffectTime = this.deadEffectTime + 1;
            if (this.deadEffectTime < 20) {
                fill(255, 0, 0, 80);
                stroke(255, 200, 0);
                strokeWeight(50);
                ellipse(this.posX - 100, this.posY, 15 * this.deadEffectTime, 15 * this.deadEffectTime);
                ellipse(this.posX, this.posY + 100, 20 * this.deadEffectTime, 20 * this.deadEffectTime);
                ellipse(this.posX, this.posY, 25 * this.deadEffectTime, 25 * this.deadEffectTime);
            }
        }
        pop();
    }

    basic() {
        this.pupil1SizeX = width * 100 / 300;
        this.pupil1SizeY = height * 100 / 300;
        this.pupil2SizeX = width * 50 / 300;
        this.pupil2SizeY = height * 50 / 300;
        this.hairColor = color(255, 255, 0);
        this.strkColor = color(0);
    }

    surprise() {
        this.pupil1SizeX = width * 100 / 300;
        this.pupil1SizeY = height * 100 / 300;
        this.pupil2SizeX = width * 70 / 300;
        this.pupil2SizeY = height * 70 / 300;
        this.hairColor = color(255, 0, 0);
        this.strkColor = color(255);
    }

    move() {
        this.posX = this.posX + this.speedX;
        this.posY = this.posY + this.speedY;

        if (this.posX > width || this.posX < 0) {
            this.speedX = -this.speedX;
        }
        if (this.posY > 220 || this.posY < 0) {
            this.speedY = -this.speedY;
        }
    }

    move2() {
        this.posX = this.posX + this.speedX;

        if (this.posX >= width) {
            this.posX = 0;
        }
    }

    checkOn() {
        this.distance = dist(this.posX, this.posY, bullet.posX, bullet.posY);

        if (this.distance < this.scaleVal * width / 2 && !this.deadman) {
            this.surprise();
            this.deadEffectTime = 0;
            this.deadPosX = this.posX;
            this.deadPosY = this.posY;
            this.deadman = true;
            bullet.posY = -100;
            gold = gold + 50;
            hitNum = hitNum + 1;
            deadEffect.play();
        }
    }

}

class gunClass {
    constructor() {
        this.posX = width / 2;
        this.posY = 9 * height / 10;
        this.gunColor = color(100);
        this.speed = 2;
    }

    display() {
        strokeWeight(1);
        if (button[1].laserOn) {
            stroke(255, 0, 0, 90);
            line(this.posX, this.posY, this.posX, -100);
        }
        image(ship, this.posX, this.posY);
    }

    userControl() {
        if (button[2].gunSpeedUpValue) {
            this.speed = this.speed + 1;
            button[2].gunSpeedUpValue = false;
        }

        if (keyIsPressed && 0 <= this.posX && this.posX <= width) {
            if (keyCode === 65) {
                this.posX = this.posX - this.speed;
            }
            if (keyCode === 68) {
                this.posX = this.posX + this.speed;
            }
        }
        if (0 > this.posX) {
            this.posX = 0;
        }
        if (width < this.posX) {
            this.posX = width;
        }
    }
}

class starClass {
    constructor() {
        this.posX = parseInt(random(0, width));
        this.posY = parseInt(random(0, height));
        this.randomSize = parseInt(random(1, 5));
        this.randomColor;
    }

    display() {
        this.randomColor = parseInt(random(50, 150));

        stroke(this.randomColor);
        strokeWeight(this.randomSize);
        point(this.posX, this.posY);
    }
}
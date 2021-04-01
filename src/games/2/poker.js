const id = '2';


function init() {
    const canvas = document.getElementById(id);
    let ctx = canvas.getContext('2d');
    
    if (canvas) {

        const dealer = new Dealer();
        dealer.startGame();
        ctx.fillStyle = 'rgb(100, 100, 100)';
        setInterval(draw, 100);

    }
}

function draw() {
    let ctx = document.getElementById(id).getContext('2d');
    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 1000, 1000);


    clickEvent(ctx);
    ctx.fillRect(450, 450, 100, 100);
}

function getMousePos(e) {
    const canvas = document.getElementById(id);
    const rect = canvas.getBoundingClientRect();
    return {
        x: ((e.clientX - rect.left) / rect.height) * 1000,
        y: ((e.clientY - rect.top) / rect.width) * 1000,
    };
}

function clickEvent(ctx) {
    const canvas = document.getElementById(id);
    canvas.addEventListener('click' || 'touchstart', (e) => {
        const mouse = getMousePos(e);

        if (450 < mouse.x && mouse.x < 550 &&
            450 < mouse.y && mouse.y < 550) {
            ctx.fillStyle = 'rgb(0, 0, 100)';
            console.log('hi');
        }

    })
}


class Player {
    constructor(user, seat) {
        this.user = {
            id: user.id,
            name: user.name
        };
        this.chips = 1000;
        this.hand = [];
        this.fold = false;
    }

    action() {
        const input = ''; // 인풋 받기 

        if (input === 'check') {
            this.check();
        }

        if (input === 'call') {
            this.call();
        }

        if (input === 'raise') {
            this.raise();
        }

        if (input === 'fold') {
            this.fold();
        }
    }

    smallBlind() {

    }

    bigBlind() {

    }

    check() {

    }

    call() {

    }

    raise() {

    }

    fold() {
        this.fold = true;
    }

    isFold() {
        return this.fold;
    }

}

class Dealer {
    constructor() {
        this.suits = ['club', 'heart', 'spade', 'diamond'];
        this.orders = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.mixTimes = 3;
        this.bigBlindBet = 2;
        this.smallBlindBet = 1;
        this.pot = 0;
        this.waitPlayers = [];
        this.players = [];
        this.cards = [];
        this.flop = [];
        this.turn = [];
        this.river = [];
    }

    startGame() {
        this.setCards();
        this.setWaitPlayers();
        this.joinWaitPlayers();
        this.preflop();
    }

    setCards() {
        for (let i = 0; i < this.suits.length; i++) {
            for (let j = 0; j < this.orders.length; j++) {
                this.cards.push(new Card(this.suits[i], this.orders[j]));
            }
        }

        for (let i = 0; i < this.mixTimes; i++) {
            this.cards = this.mixCards(this.cards);
        }

        console.log(this.cards);
    }

    mixCards(cards) {
        let unmixed = cards;
        let mixed = [];
        while (unmixed.length > 0) {
            mixed.push(unmixed.splice(this.getRandomNumber(0, unmixed.length), 1)[0]);
        }
        return mixed;
    }

    getRandomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //최댓값은 제외, 최솟값은 포함
    }

    setWaitPlayers() {
        // 서버에서 접속자 정보를 가져와서 객체 생성
        const playerData = [
            {
                id: 1,
                name: 'Jo'
            },
            {
                id: 2,
                name: 'Yoo'
            },
            {
                id: 3,
                name: 'Kim'
            }
        ];

        for (let i = 0; i < playerData.length; i++) {
            this.waitPlayers.push(new Player(playerData[i], i));
        }
    }

    joinWaitPlayers() {
        this.players = this.waitPlayers;
    }

    preflop() {
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].hand.push(this.cards.pop());
            }
        }
        console.log(this.players);
    }

    action() {
        let actionOrder = this.players;
        let i = 0;
        while (i < actionOrder.length) {
            actionOrder[i].action();
            i++;
        }
    }
}

class Card {
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }

    getSuit() {
        return this.suit;
    }

    getnumber() {
        return this.number;
    }
}
export { init };
const id = '2';

function init() {
    const canvas = document.getElementById(id);
    if (canvas) {
        const dealer = new Dealer();
        dealer.startGame();


        setInterval(draw, 100);
    }
}

function draw() {
    let ctx = document.getElementById(id).getContext('2d');

    ctx.globalCompositeOperation = 'destination-over';
    ctx.clearRect(0, 0, 1000, 1000); // 캔버스를 비운다


}

class Player {
    constructor(user, seat) {
        this.user = {
            id: user.id,
            name: user.name
        };
        this.seat = seat;
        this.chips = 1000;
        this.hand = [];
    }
}

class Dealer {
    constructor() {
        this.suits = ['club', 'heart', 'spade', 'diamond'];
        this.orders = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.mixTimes = 3;
        this.players = [];
        this.cards = [];
        this.flop = [];
        this.turn = [];
        this.river = [];
    }

    startGame() {
        this.setCards();
        this.setPlayers();
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

    setPlayers() {
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
            this.players.push(new Player(playerData[i], i));
        }
        
    }

    preflop() {
        for (let j = 0; j < 2; j++) {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].hand.push(this.cards.pop());
            }
        }
        console.log(this.players);
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
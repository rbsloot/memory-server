import { Player } from './player.model';
import { Card } from './card.model';

const fs = require('fs');

const IMG_PREFIX = 'http://localhost:9000/themes';
const THEME_CARDS: { [theme: string]: string[] } = {
    test: ['gaben.jpg', 'img2.jpg', 'img3.png'],
    memes: fs.readdirSync('./card-server/themes/memes/cards')
};

export class Game {
    isActive = false;
    cards: Card[];

    constructor(public theme: string, public players: Player[] = []) {
        this.cards = this.loadCards(theme);
    }

    get state() {
        return {
            isActive: this.isActive,
            players: this.players,
            cards: this.isActive ? this.cards : []
        }
    }

    start() {
        this.players = this.shuffle(this.players);
        this.cards = this.shuffle(this.cards);
        this.isActive = true;
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(player: Player) {
        const indexToRemove = this.players.findIndex(plr => plr.username === player.username);
        this.players.splice(indexToRemove, 1);
    }

    private loadCards(theme: string, maxCards?: number, occurrences = 2) {
        theme = theme.toLowerCase();
        const cards: Card[] = [];
        const themeCards = THEME_CARDS[theme];

        for(let cardSrc of maxCards ? themeCards.splice(0, maxCards) : themeCards) {
            for(let i = 0; i < occurrences; ++i) {
                cards.push(new Card(`${IMG_PREFIX}/${theme}/cards/${cardSrc}`));
            }
        }

        return cards;
    }

    private shuffle(array) {
        let m = array.length, t, i;

        while (m) {
            i = Math.floor(Math.random() * m--);

            t = array[m];
            array[m] = array[i];
            array[i] = t;
        }

        return array;
    }

}

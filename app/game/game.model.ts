import { Player } from './player.model';
import { Card } from './card.model';

// For future improvements, remove players as contructor input and make it a room (socket room)
const THEME_CARDS = {
    test: ['img1.jpg', 'img2.jpg', 'img3.png']
};

export class Game {
    cards: Card[];

    constructor(public theme: string, public players: Player[] = []) {
        this.cards = this.loadCards(theme);
    }

    start() {
        this.players = this.shuffle(this.players);
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(player: Player) {
        const indexToRemove = this.players.findIndex(plr => plr.username === player.username);
        this.players.splice(indexToRemove, 1);
    }

    private loadCards(theme: string) {
        theme = theme.toLowerCase();
        const cards: Card[] = [];

        for(let card of THEME_CARDS[theme]) {
            cards.push(new Card(`${theme}/${card}`));
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

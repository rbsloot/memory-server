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
    cardId = 1;

    constructor(public theme: string, public players: Player[] = [], private occurences = 2) {
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

    getCard(id: number) {
        const card = this.cards.find(card => card.id === id);
        if(!card) throw new Error(`Could not find card with id ${id}`);
        return card;
    }

    isValidSelection(card: Card) {
        const remainingCards = this.cards.filter(c => !c.isGuessed);
        const selectedCards = remainingCards.filter(c => c.isSelected);
        if(!selectedCards.every(c => c.imageUrl === card.imageUrl)) {
            for(let selectedCard of selectedCards) {
                selectedCard.isSelected = false;
            }
            return undefined;
        }
        card.isSelected = true;
        return selectedCards.concat(card);
    }

    hasCompletedCardSet(selectedCards: Card[]) {
        if(selectedCards.length !== this.occurences) {
            return false;
        }

        for(let selectedCard of selectedCards) {
            selectedCard.isGuessed = true;
            selectedCard.isSelected = false;
        }
        return true;
    }

    movePlayerTurn(activePlayer: Player) {
        let index = this.players.findIndex(player => player.username === activePlayer.username);
        if(index === -1) throw new Error(`Could not find player with username ${activePlayer.username}`);
        if(++index > this.players.length) {
            index = 0;
        }
        return this.players[index];
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(player: Player) {
        const indexToRemove = this.players.findIndex(plr => plr.username === player.username);
        this.players.splice(indexToRemove, 1);
    }

    private loadCards(theme: string, maxCards?: number, occurrences = this.occurences) {
        theme = theme.toLowerCase();
        const cards: Card[] = [];
        const themeCards = THEME_CARDS[theme];

        for(let cardSrc of maxCards ? themeCards.splice(0, maxCards) : themeCards) {
            for(let i = 0; i < occurrences; ++i) {
                cards.push(new Card(this.cardId++, `${IMG_PREFIX}/${theme}/cards/${cardSrc}`));
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

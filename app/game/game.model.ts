import { Player } from './player.model';
import { Card } from './card.model';

// For future improvements, remove players as contructor input and make it a room (socket room)

export class Game {
    constructor(public theme: string, public players?: Player[]) {

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

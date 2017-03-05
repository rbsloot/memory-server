import { Game } from '../game/game.model';
import { Player } from '../game/player.model';

export const CREATE_EVENT = 'created';
export const JOIN_EVENT = 'newPlayer';

// TODO listen for room joiners

export class GameRoom {
    private game: Game;

    constructor(public io: SocketIO.Namespace, private roomId: string, theme: string) {
        this.game = new Game(theme);
    }

    join(socket: SocketIO.Socket) {
        socket.join(this.roomId, (error) => {
            const newPlayer = new Player(socket.id);
            this.game.addPlayer(newPlayer);

            socket.emit('joinGame', { players: this.game.players, cards: [] });
            socket.broadcast.in(this.roomId).emit(JOIN_EVENT, { message: 'New player joined room', gameId: this.roomId, playerId: newPlayer.username });
        });
    }
}
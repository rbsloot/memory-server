import { Game } from '../game/game.model';
import { Player } from '../game/player.model';

// TODO listen for room joiners

export class GameRoom {
    private game: Game;

    constructor(public io: SocketIO.Namespace, private roomId: string, theme: string) {
        this.game = new Game(theme);
    }

    join(socket: SocketIO.Socket) {
        socket.join(this.roomId, (error) => {
            this.io.in(this.roomId).emit('joined', { message: 'New Socket joined room', id: this.roomId });
        });
    }
}
import { Game } from '../game/game.model';
import { Player } from '../game/player.model';

export const CREATE_EVENT = 'created';
export const JOIN_EVENT = 'joinGame';
export const PLAYER_JOIN_EVENT = 'newPlayer';
export const LEAVE_EVENT = 'playerLeave';
export const DISCONNECTED_EVENT = 'playerDisconnected';

// TODO listen for room joiners

export class GameRoom {
    private game: Game;

    constructor(public io: SocketIO.Namespace, private roomId: string, theme: string) {
        this.game = new Game(theme);
    }

    join(socket: SocketIO.Socket, newPlayer: Player) {
        socket.join(this.roomId, (error) => {
            this.game.addPlayer(newPlayer);

            socket.emit(JOIN_EVENT, { players: this.game.players, cards: [] });
            socket.broadcast.in(this.roomId).emit(PLAYER_JOIN_EVENT, { username: newPlayer.username });
        });
    }

    leave(player: Player, disconnected = false) {
        console.log(`Player ${player.username} ${disconnected ? 'disconnected' : 'left'}`);
        this.game.removePlayer(player);
        this.io.in(this.roomId).emit(disconnected ? DISCONNECTED_EVENT : LEAVE_EVENT, { username: player.username });
    }
}
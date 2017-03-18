import { Game } from '../game/game.model';
import { Player } from '../game/player.model';

export const CREATE_EVENT = 'created';
export const JOIN_EVENT = 'joinGame';
export const PLAYER_JOIN_EVENT = 'newPlayer';
export const LEAVE_EVENT = 'playerLeave';
export const DISCONNECTED_EVENT = 'playerDisconnected';
export const START_GAME_EVENT = 'startGame';
export const SELECT_CARD_EVENT = 'selectCard';
export const NEW_CARD_STATE_EVENT = 'newCardState';
export const MOVE_PLAYER_TURN_EVENT = 'movePlayerTurn';
export const NEW_TIMER_START_EVENT = 'newTimerStart';

// TODO listen for room joiners

export class GameRoom {
    private game: Game;

    constructor(public io: SocketIO.Namespace, private roomId: string, theme: string) {
        this.game = new Game(theme);
    }

    join(socket: SocketIO.Socket, newPlayer: Player) {
        socket.join(this.roomId, (error) => {
            console.log('PLAYER JOINED', newPlayer.username);
            this.game.addPlayer(newPlayer);

            socket.emit(JOIN_EVENT, this.game.state);
            socket.broadcast.in(this.roomId).emit(PLAYER_JOIN_EVENT, { username: newPlayer.username });
        });
    }

    leave(player: Player, disconnected = false) {
        console.log(`Player ${player.username} ${disconnected ? 'disconnected' : 'left'}`);
        this.game.removePlayer(player);
        this.emitToRoom(disconnected ? DISCONNECTED_EVENT : LEAVE_EVENT, { username: player.username });
    }

    start() {
        this.game.start();
        this.emitToRoom(START_GAME_EVENT, this.game.state);
    }

    selectCard(cardId: number, activePlayer: Player) {
        const card = this.game.getCard(cardId);
        this.emitToRoom(SELECT_CARD_EVENT, card);

        const isValidSelecttion = this.game.isValidSelection(card);
        if(!isValidSelecttion) {
            // TODO, send new card state, move turn
            this.movePlayerTurn(activePlayer);
            this.emitToRoom(NEW_CARD_STATE_EVENT, this.game.cards);
            return;
        }
        // Determine guesses
        const hasCompletedSet = this.game.hasCompletedCardSet(isValidSelecttion);
        if(hasCompletedSet) {
            this.emitToRoom(NEW_CARD_STATE_EVENT, this.game.cards);
        }
        this.emitToRoom(NEW_TIMER_START_EVENT);
    }

    movePlayerTurn(player: Player) {
        const newPlayer = this.game.movePlayerTurn(player);
        this.emitToRoom(MOVE_PLAYER_TURN_EVENT, newPlayer);
    }

    private emitToRoom(event: string, ...args: any[]) {
        return this.io.in(this.roomId).emit(event, ...args);
    }
}
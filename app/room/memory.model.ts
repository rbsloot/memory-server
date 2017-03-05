import { BaseSocketService } from '../services/base-socket.service';
import { GameRoom, CREATE_EVENT, JOIN_EVENT } from './game-room.model';

interface GameData {
    theme: string;
    socketId: string;
}

export class Memory {
    private rooms: { [roomId: string]: GameRoom } = {};
    private roomId = 0;

    constructor(public io: SocketIO.Namespace) {
        this.initSocketListener();
    }

    private initSocketListener() {
        this.io.on('connection', (socket: SocketIO.Socket) => {
            console.log('CLIENT CONNECTED ON MEMORY', socket.id);

            socket.on('newGame', this.onNewGame.bind(this, socket));
            socket.on('joinGame', this.joinGame.bind(this, socket));

            socket.on('disconnect', this.onDisconnect.bind(this));
        });
    }

    private onNewGame(socket: SocketIO.Socket, gameData: GameData) {
        const newRoomId = (++this.roomId).toString();
        const room = this.rooms[newRoomId] = new GameRoom(this.io, newRoomId, gameData.theme);
        console.log('NEW GAME ROOM', newRoomId);

        socket.emit(CREATE_EVENT, { id: newRoomId });
    }

    private joinGame(socket: SocketIO.Socket, roomId: string) {
        const room = this.rooms[roomId];
        if(room) {
            room.join(socket);
        } else {
            BaseSocketService.emitError(JOIN_EVENT, { message: `Game with id '${roomId}' is not available` }, socket);
        }
    }

    private onDisconnect() {
        console.log('DISCONNECT MEMORY');
    }
}
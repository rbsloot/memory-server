import { GameRoom } from './game-room.model';

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

        socket.emit('created', { message: 'Created new room', id: newRoomId })
        room.join(socket);
    }

    private joinGame(socket: SocketIO.Socket, roomId: string) {
        const room = this.rooms[roomId];
        room.join(socket);
    }

    private onDisconnect() {
        console.log('DISCONNECT MEMORY');
    }
}
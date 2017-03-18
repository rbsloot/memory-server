import { BaseSocketService } from '../services/base-socket.service';
import { GameRoom, CREATE_EVENT, JOIN_EVENT, SELECT_CARD_EVENT } from './game-room.model';
import { Player } from '../game/player.model';

interface GameData {
    theme: string;
    socketId: string;
}

interface JoinData {
    gameId: string;
    username: string;
}

export class Memory {
    private players: { [socketId: string]: Player } = {};
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
            socket.on('leaveGame', this.leaveGame.bind(this, socket));

            socket.on('startGame', this.onStartGame.bind(this));
            socket.on(SELECT_CARD_EVENT, this.onSelectCard.bind(this, socket));

            socket.on('disconnect', this.onDisconnect.bind(this, socket));
        });
    }

    private onNewGame(socket: SocketIO.Socket, gameData: GameData) {
        const newRoomId = (++this.roomId).toString();
        const room = this.rooms[newRoomId] = new GameRoom(this.io, newRoomId, gameData.theme);
        console.log('NEW GAME ROOM', newRoomId);

        socket.emit(CREATE_EVENT, { id: newRoomId });
    }

    private joinGame(socket: SocketIO.Socket, { gameId: roomId, username }: JoinData) {
        const room = this.rooms[roomId];
        if(room) {
            const player = this.players[socket.id] || new Player(username || socket.id);
            room.join(socket, player);
            player.addRoom(roomId);

            if(!this.players[socket.id]) {
                this.players[socket.id] = player;
            }
        } else {
            BaseSocketService.emitError(JOIN_EVENT, { message: `Game with id '${roomId}' is not available` }, socket);
        }
    }

    private leaveGame(socket: SocketIO.Socket, roomId: string) {
        const player = this.players[socket.id];
        if(!player) return;
        player.removeRoom(roomId);
        this.rooms[roomId].leave(player);
        socket.leave(roomId);
    }

    private onStartGame(roomId: string) {
        this.rooms[roomId].start();
    }

    private onSelectCard(socket: SocketIO.Socket, roomId: string, cardId: number) {
        this.rooms[roomId].selectCard(cardId, this.players[socket.id]);
    }

    private onDisconnect(socket: SocketIO.Socket) {
        console.log('DISCONNECT', socket.id);
        const player = this.players[socket.id];
        if(!player) return;
        for(let roomId of player.activeRoomIds) {
            this.rooms[roomId].leave(player, true);
        }
        socket.leaveAll();
    }
}
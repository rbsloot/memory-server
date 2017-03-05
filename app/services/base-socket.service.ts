interface SocketError {
    message: string;
}

class BaseSocketServiceClass {

    emitError(event: string, error: SocketError, socket: SocketIO.Socket) {
        socket.emit(event + 'Error', error);
    }
}

export const BaseSocketService = new BaseSocketServiceClass();

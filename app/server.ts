const io:SocketIO.Server = require('socket.io')();

import { Memory } from './room/memory.model';
import { ServerConfig } from './server.config';

const memory = new Memory(io.of('/memory'));

io.listen(ServerConfig.io.port);
console.log(`IO listening on port ${ServerConfig.io.port}`);

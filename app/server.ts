const io:SocketIO.Server = require('socket.io')();
const port = 3000;

io.on('connection', client => {
    console.log(client.id);
});

io.listen(port);
console.log(`IO listening on port ${port}`);

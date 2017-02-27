const io:SocketIO.Server = require('socket.io')();

io.on('connection', client => {
    console.log(client.id);
});

io.listen(3000);

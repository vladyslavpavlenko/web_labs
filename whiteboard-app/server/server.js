const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log('Client connected!');

    socket.on('canvas-data', (data) => {
        socket.broadcast.emit('canvas-data', data);
    })
})

const server_port = 8080;

http.listen(server_port, () => {
    console.log(`Listening on port ${server_port}!`);
})
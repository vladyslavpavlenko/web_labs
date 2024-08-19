const express = require('express');
const cors = require('cors'); // Import cors middleware

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:5173"
}));

io.on('connection', (socket) => {
    console.log('Client connected!');

    socket.on('canvas-data', (data) => {
        socket.broadcast.emit('canvas-data', data);
    });

    socket.on('clear-canvas', () => {
        socket.broadcast.emit('clear-canvas');
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected!');
    });
});

const server_port = 8080;

http.listen(server_port, () => {
    console.log(`Listening on port ${server_port}!`);
});
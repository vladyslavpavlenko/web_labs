// ts-node ./src/server.ts

import { WebSocketServer } from 'ws';

const PORT = 8080
const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received:', message.toString());

        wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

console.log('WebSocket server is listening on ws://localhost:' + PORT);
const { createServer } = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const httpServer = createServer(app);
const wss = new WebSocket.Server({ server: httpServer });

// Замените 'your_secret_key' на ваш реальный ключ
const secretKey = 'your_secret_key';

app.use(cors({
    origin: 'http://localhost:5174', // Укажите ваш фронтенд URL
    credentials: true,
}));

app.use(express.json());

app.post('/login', (req, res) => {
    const { username } = req.body;
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});

function handleMessage(ws, message) {
    try {
        const parsedMessage = JSON.parse(message);
        console.log(`Received message: ${parsedMessage.text}`);

        // Broadcast the message to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage));
            }
        });
    } catch (error) {
        console.error('Failed to parse message:', error);
    }
}

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        handleMessage(ws, message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

httpServer.listen(2567, () => {
    console.log("WebSocket server is running on ws://localhost:2567");
});

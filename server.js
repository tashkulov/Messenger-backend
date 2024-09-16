const { createServer } = require('http');
const express = require('express');
const { Server } = require('colyseus');
const { ChatRoom } = require('./ChatRoom');

const app = express();
const httpServer = createServer(app);
const gameServer = new Server({ server: httpServer });

gameServer.define('chat', ChatRoom);

gameServer.listen(2567, () => {
    console.log('Colyseus сервер запущен на ws://localhost:2567');
});

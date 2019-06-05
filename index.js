const path = require('path');
const express = require('express');
const WebSocket = require('ws');
const app = express();

const WS_PORT = process.env.WS_PORT || 3001;
const HTTP_PORT = process.env.HTTP_PORT || 3000;

const  wsServer = new WebSocket.Server({ port: WS_PORT }, () => console.log(`WS server is listening @${WS_PORT}`));

let connectClients = [];

wsServer.on('connection', (ws, req) => {
    console.log('Connected');
    // add new connected client
    connectClients.push(ws);
    // listen for message from streamer
    ws.on('message', data => {
        connectClients.forEach((ws, i) => {
            if (ws.readyState === ws.OPEN) { // check if the connection is open
                ws.send(data);
            }
            else { // if not remove from the array of connected ws
                connectClients.splice(i, 1)
            }
        });
    });
});

// HTTP stuff
app.get('/client', (req, res) => {
    return res.sendFile(path.resolve(__dirname, './client.html'));
})

app.get('/streamer', (req, res) => {
    return res.sendFile(path.resolve(__dirname, './streamer.html'));
})

app.listen(HTTP_PORT, () => console.log(`HTTP server is listening @${HTTP_PORT}`))
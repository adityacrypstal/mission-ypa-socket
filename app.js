require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});
require('./redis');
const {socketAdd, socketRemove} = require('./utils');

const PORT = process.env.PORT || 6001;
let users = {};

io.use((socket, next) => {
    // if (socket.handshake.query && socket.handshake.query.token) {
        // jwt.verify(socket.handshake.query.token, 'NJVi5pKMQPqQXpyWzyWjIASUoNWPgcG8', function (err, decoded) {
        //     if (err) return next(new Error('Authentication error'));
        //     socket.decoded = decoded;
            next();
        // });
    // } else {
    //     next(new Error("invalid"));
    // }
}).on("connection", (socket) => {
    socketAdd(socket);
});

app.get('/test', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
server.listen(PORT, () => console.log("Socket server started at " + PORT));


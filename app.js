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

const PORT = process.env.PORT || 6000;
let users = {};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, 'NJVi5pKMQPqQXpyWzyWjIASUoNWPgcG8', function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error("invalid"));
    }
}).on("connection", (socket) => {
    socketAdd(socket.decoded.id, socket);
    socket.on("join", (data) => {
        const user = {
            socketId: data.driverId,
            coords: data.location,
        };
        users[data.driverId] = data.location;
        socket.broadcast.emit("new-user", user);
        socket.emit("current-user", user);
        socket.emit("users", users);
    });

    socket.on("position-change", (data) => {
        users[data.driverId] = data.location;
        socket.emit("users", users);
        // io.emit("position-change", data);
    });

    socket.on("disconnect", (data) => {
        socketRemove(socket.decoded.id);
        delete users[data.driverId];
        socket.broadcast.emit("users", users);
    });
});


server.listen(PORT, () => console.log("Socket server started at " + PORT));

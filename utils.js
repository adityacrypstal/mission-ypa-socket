let sockets = {};
const socketAdd = (userId, socket) => {
    sockets[userId] = socket;
};
const socketRemove = (userId) => {
    delete sockets[userId];
};
const getSocket = (userId) => sockets[userId];
module.exports = {sockets,socketAdd,socketRemove,getSocket};

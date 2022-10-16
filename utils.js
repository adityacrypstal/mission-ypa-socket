let socket ;

const socketAdd = (data) => {
    socket = data;
};

const getSocket = () => socket;

module.exports = {socketAdd, getSocket};

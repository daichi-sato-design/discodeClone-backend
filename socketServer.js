const authSocket = require('./middleware/authSocket');
const disconnectHander = require('./socketHandlers/disconnectHandler');
const newConnectionHandler = require('./socketHandlers/newConnectionHandler');

const registerSocketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      method: ['GET', 'POST'],
    },
  });

  io.use(authSocket);

  io.on('connection', (socket) => {
    console.log('user connected');
    console.log(socket.id);

    newConnectionHandler(socket, io);

    socket.on('disconnect', () => {
      disconnectHander(socket);
    })
  });

}

module.exports = {
  registerSocketServer,
};
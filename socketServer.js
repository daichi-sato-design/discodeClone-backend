const authSocket = require('./middleware/authSocket');
const disconnectHander = require('./socketHandlers/disconnectHandler');
const newConnectionHandler = require('./socketHandlers/newConnectionHandler');
const serverStore = require('./serverStore');

const registerSocketServer = (server) => {
  const io = require('socket.io')(server, {
    cors: {
      origin: '*',
      method: ['GET', 'POST'],
    },
  });

  serverStore.setSocketServerInstance(io);

  io.use(authSocket);

  io.on('connection', (socket) => {
    newConnectionHandler(socket, io);

    socket.on('disconnect', () => {
      disconnectHander(socket);
    })
  });

}

module.exports = {
  registerSocketServer,
};
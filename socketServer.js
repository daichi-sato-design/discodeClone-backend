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

  const emitOnlineUsers = () => {
    const onlineUsers = serverStore.getOnlineUsers();
    io.emit('online-users', { onlineUsers });
  }

  io.on('connection', (socket) => {
    newConnectionHandler(socket, io);
    emitOnlineUsers();
    
    socket.on('disconnect', () => {
      disconnectHander(socket);
    });
  });

  setInterval(() => {
    emitOnlineUsers();
  }, [1000 * 60 * 5]);
}

module.exports = {
  registerSocketServer,
};
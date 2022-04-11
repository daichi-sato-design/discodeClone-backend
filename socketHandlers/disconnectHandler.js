const serverStore = require('../serverStore');

const disconnectHander = (socket) => {
  serverStore.removeConnectedUser(socket.id);
};

module.exports = disconnectHander;
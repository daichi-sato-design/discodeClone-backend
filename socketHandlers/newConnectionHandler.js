const serverStore = require('../serverStore');
const friendsUpdate = require('./updates/friends');

const newConnectionHandler = async (socket, io) => {
  const userDetails = socket.user;

  serverStore.addNewConnectedUser({
    socketId: socket.id,
    userId: userDetails.userId,
  });

  // 保留中のフレンド申請リストを更新
  friendsUpdate.updateFriendsPendingInvitations(userDetails.userId);
  // フレンドリストを更新
  friendsUpdate.updateFriends(userDetails.userId);

}

module.exports = newConnectionHandler;
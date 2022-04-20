const FriendInvitation = require('../../models/friendInvitation');
const serverStore = require('../../serverStore');

// ユーザーがオンラインの場合、フレンド申請のリストを更新
const updateFriendsPendingInvitations = async (userId) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate('senderId', '_id username mail');

    // 特定のuserIdのすべてのアクティブな接続を検索します
    const receiverList = serverStore.getActiveConnections(userId);

    const io = serverStore.getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit('friends-invitations', {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });

  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  updateFriendsPendingInvitations,
}
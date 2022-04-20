const FriendInvitation = require('../../models/friendInvitation');
const User = require('../../models/user');
const serverStore = require('../../serverStore');

// ユーザーがオンラインの場合、フレンド申請のリストを更新
const updateFriendsPendingInvitations = async (userId) => {
  try {
    // 特定のIDのアクティブな接続を検索（オンラインユーザー）
    const receiverList = serverStore.getActiveConnections(userId);
    if (receiverList.length > 0) {
      // 特定のIDに送られたフレンド申請を取得
      const pendingInvitations = await FriendInvitation.find({
        receiverId: userId,
      }).populate('senderId', '_id username mail');
      // ioサーバーインスタンスを取得
      const io = serverStore.getSocketServerInstance();
      // 特定のIDのアクティブな接続にイベントの通知
      receiverList.forEach((receiverSocketId) => {
        io.to(receiverSocketId).emit('friends-invitations', {
          pendingInvitations: pendingInvitations ? pendingInvitations : [],
        });
      });
    }
  } catch (err) {
    console.log(err);
  }
}

// ユーザーがオンラインの場合、フレンドリストを更新
const updateFriends = async (userId) => {
  try {
    // 特定のIDのアクティブな接続を検索（オンラインユーザー）
    const receiverList = serverStore.getActiveConnections(userId);
    if (receiverList.length > 0) {
      // 特定のIDのユーザーを取得
      const user = await User.findById(
        userId,
        { _id: 1, friends: 1 },
      ).populate('friends', '_id username mail');
      if (user) {
        const friendsList = user.friends.map((f) => {
          return {
            id: f._id,
            mail: f.mail,
            username: f.username,
          };
        });
        // ioサーバーインスタンスを取得
        const io = serverStore.getSocketServerInstance();
        // 特定のIDのアクティブな接続にイベントの通知
        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit('friends-list', {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  updateFriendsPendingInvitations,
  updateFriends,
}
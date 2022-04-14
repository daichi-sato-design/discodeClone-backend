const User = require("../../models/user");
const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;
  const { userId, mail } = req.user;

  // 招待したい友達がユーザーでないか確認します
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res.status(409).send('不正なメールアドレスが入力されています');
  }

  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });
  if (!targetUser) {
    return res.status(404).send(`${targetMailAddress} のユーザーが見つかりませんでした。 メールアドレスをご確認ください`);
  }

  // 招待状がすでに送信されているかどうかを確認します
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });
  if (invitationAlreadyReceived) {
    return res.status(409).send('フレンド申請はすでに送信されています');
  }

  // 招待したいユーザーがすでに友達かどうかを確認します
  const userAlreadyFriends = targetUser.friends.find((friendId) => friendId.toStrind() === userId.toString());
  if (userAlreadyFriends) {
    return res.status(409).send('友達はすでに追加されています。 友達リストをチェックしてください');
  };

  // データベースに新しいフレンド申請を作成します
  const newInvitation = await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // 招待状が正常に作成された場合、他のユーザーがオンラインの場合は友達のフレンド申請を更新します

  // 保留中の申請の更新を特定のユーザーに送信する
  friendsUpdates.updateFriendsPendingInvitations(targetUser._id.toString());

  return res.status(201).send('フレンド申請を送信しました');
}

module.exports = postInvite;
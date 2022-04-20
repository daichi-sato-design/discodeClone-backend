const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const friendsUpdates = require('../../socketHandlers/updates/friends');

const postAccept = async (req, res) => {
  try{
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);
    if (!invitation) {
      return res.status(401).send('エラーが発生しました。もう一度やり直してください');
    }

    const { senderId, receiverId } = invitation;

    // 「データベース」各ユーザー（送信者・受信者）にフレンドを追加
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    // 「データベース」フレンド追加後に残った申請の情報を削除
    await FriendInvitation.findByIdAndDelete(id);

    // 「フロントエンド」ユーザーがオンラインの場合は、フレンドのリストを更新

    // 「フロントエンド」ユーザーがオンラインの場合は、フレンド申請のリストを更新
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send('フレンドに追加しました');

  } catch (err) {
    console.log(err);
    return res.status(500).send('エラーが発生しました。もう一度やり直してください');
  }
}

module.exports = postAccept;
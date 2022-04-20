const FriendInvitation = require('../../models/friendInvitation');
const friendsUpdate = require('../../socketHandlers/updates/friends');

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    // 友達のフレンド申請コレクションからその申請を削除する
    const invitationExist = await FriendInvitation.exists({ _id: id });
    if (invitationExist) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // 保留中のフレンド申請を更新する
    friendsUpdate.updateFriendsPendingInvitations(userId);

    res.status(200).send('フレンド申請は拒否されました');

  } catch (err) {
    console.log(err);
    return res.status(500).send('エラーが発生しました。もう一度やり直してください');
  }
}

module.exports = postReject;
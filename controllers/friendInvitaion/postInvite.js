const User = require("../../models/user");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;

  const { userId, mail } = req.user;
  // [check] if friend that we would like to invite is not user
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res.status(409).send('不正なメールアドレスが入力されています');
  }
  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });
  if (!targetUser) {
    return res.status(404).send(`${targetMailAddress} のフレンドが見つかりませんでした。 メールアドレスをご確認ください`);
  }

  // [check] if invitation has been already sent

  return res.send('controller is working');
}

module.exports = postInvite;
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postLogin = async(req, res) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail: mail.toLowerCase() });
    if (user && (await bcrypt.compare(password, user.password))) {
      // JWTトークンの生成
      const token = jwt.sign(
      {
        userId: user._id,
        mail,
      },
      process.env.TOKEN_KEY,
      {
        expiresIn: '24h'
      }
    );
      return res.status(200).json({
        userDetails: {
          mail: user.mail,
          token: token,
          username: user.username,
        },
      });
    }
    return res.status(400).send('無効な資格情報です。 もう一度やり直してください');

  } catch (err) {
    return res.status(500).send('エラーが発生しました。 もう一度やり直してください');
  }
}

module.exports = postLogin
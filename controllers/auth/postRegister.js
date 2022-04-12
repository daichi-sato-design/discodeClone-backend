const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const postRegister = async (req, res) => {
  try {
    const { username, mail, password } = req.body;
    // ユーザーが存在するかどうかを確認
    const userExists = await User.exists({ mail: mail.toLowerCase()});
    if (userExists) {
      return res.status(409).send("E-mail already in use.");
    }
    // パスワードを暗号化
    const encryptedPassword = await bcrypt.hash(password, 10);
    // ユーザードキュメントを作成してデータベースに保存
    const user = await User.create({
      username,
      mail: mail.toLowerCase(),
      password: encryptedPassword,
    });
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
    res.status(201).json({
      userDetails: {
        mail: user.mail,
        token: token,
        username: user.username,
      },
    });

  } catch (err) {
    return res.status(500).send('Error occured. Please try again')
  }
}

module.exports = postRegister

// 認証関数をラップ化

const postLogin = require('./postLogin');
const postRegister = require('./postRegister');

exports.controllers = {
  postLogin,
  postRegister,
};
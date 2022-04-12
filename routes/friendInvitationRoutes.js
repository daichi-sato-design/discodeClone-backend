const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validator = require('express-joi-validation').createValidator({});

const friendInvitationControllers = require('../controllers/friendInvitaion/friendInvitationControllers');
const auth = require('../middleware/auth');

const postFriendInvitationSchema = Joi.object({
  targetMailAddress: Joi.string().email().required(),
});

router.post(
  '/invite',
  auth,
  validator.body(postFriendInvitationSchema),
  friendInvitationControllers.controllers.postInvite,
);

module.exports = router;
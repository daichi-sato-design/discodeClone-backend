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

const inviteDecistionSchema = Joi.object({
  id: Joi.string().required(),
});

router.post(
  '/accept',
  auth,
  validator.body(inviteDecistionSchema),
  friendInvitationControllers.controllers.postAccept,
);

router.post(
  '/reject',
  auth,
  validator.body(inviteDecistionSchema),
  friendInvitationControllers.controllers.postReject,
);

module.exports = router;
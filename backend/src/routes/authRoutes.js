const express = require('express');
const { body } = require('express-validator');
const {
  register,
  login,
  verifyEmail,
  resendEmailVerification,
  initiatePhoneVerification,
  verifyPhone
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('phone').notEmpty()
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], login);

router.post('/verify-email', verifyEmail);
router.post('/resend-email', resendEmailVerification);
router.post('/phone/initiate', initiatePhoneVerification);
router.post('/phone/verify', verifyPhone);

module.exports = router;

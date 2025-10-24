const crypto = require('crypto');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/token');
const { sendEmail } = require('../utils/email');
const { sendSMS } = require('../utils/sms');

const buildValidationError = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation error');
    error.statusCode = 422;
    error.errors = errors.array();
    throw error;
  }
};

const register = async (req, res, next) => {
  try {
    buildValidationError(req);

    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password,
      phone,
      emailVerificationToken,
      emailVerificationExpires: new Date(Date.now() + 1000 * 60 * 60),
      phoneVerificationCode,
      phoneVerificationExpires: new Date(Date.now() + 1000 * 60 * 10)
    });

    const emailVerificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${emailVerificationToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `<p>Hello ${user.name},</p><p>Please verify your email by clicking <a href="${emailVerificationUrl}">here</a>.</p>`
    });

    await sendSMS({
      to: user.phone,
      body: `Your verification code is ${phoneVerificationCode}`
    });

    res.status(201).json({ message: 'Registration successful. Verification codes sent.' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    buildValidationError(req);

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: user._id, role: user.role }, '7d');

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isPhoneVerified: user.isPhoneVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    next(error);
  }
};

const resendEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationExpires = new Date(Date.now() + 1000 * 60 * 60);
    await user.save();

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: 'Verify your email',
      html: `<p>Hello ${user.name},</p><p>Please verify your email by clicking <a href="${verificationUrl}">here</a>.</p>`
    });

    res.json({ message: 'Verification email resent' });
  } catch (error) {
    next(error);
  }
};

const initiatePhoneVerification = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.phoneVerificationCode = code;
    user.phoneVerificationExpires = new Date(Date.now() + 1000 * 60 * 10);
    await user.save();

    await sendSMS({
      to: user.phone,
      body: `Your verification code is ${code}`
    });

    res.json({ message: 'Verification code sent' });
  } catch (error) {
    next(error);
  }
};

const verifyPhone = async (req, res, next) => {
  try {
    const { phone, code } = req.body;
    const user = await User.findOne({ phone, phoneVerificationCode: code });

    if (!user || user.phoneVerificationExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.isPhoneVerified = true;
    user.phoneVerificationCode = undefined;
    user.phoneVerificationExpires = undefined;
    await user.save();

    res.json({ message: 'Phone verified successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendEmailVerification,
  initiatePhoneVerification,
  verifyPhone
};

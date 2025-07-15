const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { sendEmail } = require('../services/emailService');
const generateOTP = require('../utils/generateOTP');
const { validateEmail, validatePassword } = require('../utils/validate');

const signup = async (req, res) => {
  const { email, password, role } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ email, password, role });
    await user.save();

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await new OTP({ email, otp, expiresAt }).save();

    await sendEmail(email, 'Verify your email', `Your OTP is ${otp}`);

    res.status(201).json({ message: 'User registered. OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    await User.updateOne({ email }, { isVerified: true });
    await OTP.deleteOne({ email, otp });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isVerified) return res.status(400).json({ message: 'Email not verified' });
    if (user.isBlocked) return res.status(403).json({ message: 'Account is blocked' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await new OTP({ email, otp, expiresAt }).save();

    await sendEmail(email, 'Reset Password OTP', `Your OTP is ${otp}`);

    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!validatePassword(newPassword)) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    user.password = newPassword;
    await user.save();
    await OTP.deleteOne({ email, otp });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = { signup, verifyOTP, signin, forgotPassword, resetPassword };
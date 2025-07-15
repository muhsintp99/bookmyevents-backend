const express = require('express');
const router = express.Router();
const { signup, verifyOTP, signin, forgotPassword, resetPassword } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/register', signup); // Alias for signup
router.post('/signin', signin);
router.post('/login', signin); // Alias for signin
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
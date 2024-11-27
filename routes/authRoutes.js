//routes/authRoutes.js
const express = require('express');
const router = express.Router();
const checkUserExists = require('../middleware/checkUserExists');
const { register, login,sendPasswordResetEmail } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', sendPasswordResetEmail);

module.exports = router;
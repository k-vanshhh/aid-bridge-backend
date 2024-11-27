const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/User');

exports.sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Step 1: Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Generate new passwo
    const newPassword = crypto.randomBytes(8).toString('hex');
    user.password = newPassword;
    await user.save();

    // Step 4: Setup email transporter with detailed error logging
    console.log('Setting up email transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debug logs
      logger: true  // Enable logger
    });

    // Step 5: Verify transporter configuration
    try {
      await transporter.verify();
      console.log('Transporter verification successful');
    } catch (verifyError) {
      console.error('Transporter verification failed:', verifyError);
      throw new Error('Email configuration error');
    }

    // Step 6: Setup email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `Your new password is: ${newPassword}`,
      html: `
        <h1>Password Reset</h1>
        <p>Your new password is: <strong>${newPassword}</strong></p>
        <p>Please change your password after logging in.</p>
      `
    };

    // Step 7: Send email
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);

    res.status(200).json({ 
      message: 'Password reset successfully, email sent',
      messageId: info.messageId // This can help in tracking the email
    });

  } catch (error) {
    console.error('Detailed error during password reset:', {
      errorMessage: error.message,
      errorStack: error.stack,
      errorName: error.name
    });

    // Send more specific error messages based on the error type
    if (error.message === 'Email configuration error') {
      return res.status(500).json({ 
        message: 'Email server configuration error. Please contact support.',
        error: 'EMAIL_CONFIG_ERROR'
      });
    }

    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        message: 'Email authentication failed. Please check email credentials.',
        error: 'EMAIL_AUTH_ERROR'
      });
    }

    res.status(500).json({ 
      message: 'Server error during password reset',
      error: error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If password was reset, prompt user to change password
    // if (user.isPasswordReset) {
    //   return res.status(403).json({
    //     message: 'Password reset required. Please change your password after logging in.',
    //   });
    // }

    // If login is successful, issue JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// middleware/checkUserExists.js
const User = require('../models/User');

const checkUserExists = async (req, res, next) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Proceed if the user exists
  next();
};

module.exports = checkUserExists;

const express = require('express');
const router = express.Router();
const { getCurrentUser, updateUser ,getAllUsers,deleteUser } = require('../controllers/userController');
const checkAdmin = require('../middleware/checkAdmin'); // New middleware

const verifyToken = require('../middleware/verifyToken');

router.get('/me', verifyToken, getCurrentUser);
router.put('/me', verifyToken, updateUser);
router.delete('/:userId', verifyToken, deleteUser);
router.get('/', verifyToken, checkAdmin, getAllUsers);


module.exports = router;
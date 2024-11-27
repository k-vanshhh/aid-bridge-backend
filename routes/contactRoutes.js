// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const checkAdmin = require('../middleware/checkAdmin');
const { 
  submitContact, 
  getContacts, 
  updateContactStatus ,
  respondToQuery
} = require('../controllers/contactController');

router.post('/', submitContact);
router.get('/', getContacts);
// router.put('/:id', updateContactStatus);
// Respond to a user query
// router.post('/:queryId/respond', checkAdmin, respondToQuery);
router.post('/:queryId/respond', respondToQuery);

// router.get('/test-email', async (req, res) => {
//   try {
//     const emailService = require('../utils/emailService');

//     await emailService.sendEmail(
//       'test-recipient@example.com', // Replace with your email
//       'Test Email Subject',
//       'This is a test email sent from our Node.js app.',
//       '<p>This is a <b>test email</b> sent from our Node.js app.</p>'
//     );

//     res.status(200).json({ success: true, message: 'Test email sent successfully.' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Failed to send test email.' });
//   }
// });


module.exports = router;

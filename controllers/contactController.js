// controllers/contactController.js
const Contact = require('../models/Contact');
const emailService = require('../utils/emailService');

exports.respondToQuery = async (req, res) => {
  const { queryId } = req.params;
  const { response } = req.body;

  try {
    console.log('Finding query with ID:', queryId);  // Log the query ID being searched

    // Find the query by its ID
    const query = await Contact.findById(queryId);
    if (!query) {
      console.log('Query not found');  // Log if query not found
      return res.status(404).json({ message: 'Query not found' });
    }

    console.log('Query found:', query);  // Log the query details

    // Send the email response
    console.log('Sending response email to:', query.email);  // Log email recipient
    await emailService.sendEmail(
      query.email, // Recipient's email
      'Response to Your Query', // Subject
      response, // Plain text email body
      `<p>${response}</p>` // HTML email body (optional)
    );

    // Update the query status in the database
    console.log('Updating query status to "Resolved"');  // Log status update
    query.status = 'Resolved';
    await query.save();

    res.status(200).json({ message: 'Response sent successfully and query marked as resolved.' });
  } catch (error) {
    console.error('Error responding to query:', error);  // Log the specific error
    res.status(500).json({ message: 'Failed to send response. Please try again later.' });
  }
};



// @desc    Submit a new contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;

    const contact = await Contact.create({
      fullName,
      email,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to submit contact form',
      error: error.message
    });
  }
};

// @desc    Get all contact submissions
// @route   GET /api/contact-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
};


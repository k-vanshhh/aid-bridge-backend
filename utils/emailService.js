const nodemailer = require('nodemailer');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Use your email provider (e.g., Gmail)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
  try {
    console.log('Sending email to:', to);  // Log recipient email

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      to, // Recipient address
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);  // Log success message
  } catch (error) {
    console.error('Error sending email:', error);  // Log the specific error
    throw new Error('Could not send email');
  }
};

module.exports = { sendEmail };

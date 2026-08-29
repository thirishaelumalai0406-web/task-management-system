const nodemailer = require('nodemailer');

// Create a reusable transporter from environment variables
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send an email. Failures are swallowed and logged so they never break the API.
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log(`Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error(`Failed to send email to ${to} (${subject}):`, error.message);
  }
};

module.exports = sendEmail;

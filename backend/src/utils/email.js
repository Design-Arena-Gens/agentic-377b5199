const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_URL) {
    return nodemailer.createTransport(process.env.SMTP_URL);
  }

  if (!process.env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendEmail = async ({ to, subject, html }) => {
  if (!to) {
    throw new Error('Recipient email is required');
  }

  const transporter = createTransporter();

  if (!transporter) {
    console.warn('Mail transport not configured; skipping email send');
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@ecommerce.com',
    to,
    subject,
    html
  });
};

module.exports = {
  sendEmail
};

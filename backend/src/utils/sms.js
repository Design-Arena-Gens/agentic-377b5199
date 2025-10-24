const twilio = require('twilio');

let client;

const getClient = () => {
  if (client) return client;
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  return client;
};

const sendSMS = async ({ to, body }) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
    console.warn('Twilio credentials missing; skipping SMS send');
    return;
  }

  const twilioClient = getClient();
  await twilioClient.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER,
    to,
    body
  });
};

module.exports = {
  sendSMS
};

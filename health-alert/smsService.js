const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMSAlert = async (message) => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: process.env.EMERGENCY_PHONE,
    });
    console.log('📱 SMS alert sent!');
  } catch (err) {
    console.error('❌ SMS error:', err.message);
  }
};

module.exports = { sendSMSAlert };

const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

async function sendVoiceCall() {
  try {
    const call = await client.calls.create({
      url: 'https://handler.twilio.com/twiml/EHf06c80aa501dcfececf04f739eb7028b', // <-- Put your TwiML URL here
      to: process.env.EMERGENCY_PHONE,
      from: process.env.TWILIO_PHONE,
    });
    console.log('📞 Voice call initiated! Call SID:', call.sid);
  } catch (error) {
    console.error('❌ Voice call error:', error);
  }
}

module.exports = { sendVoiceCall };

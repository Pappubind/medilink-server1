const { sendEmailAlert } = require("./emailService");
const { sendSMSAlert } = require("./smsService");
const { sendVoiceCall } = require("./callService");

// ... inside loop where data is being processed
if (heart_rate < 50 || heart_rate > 120 || spo2 < 92) {
  const alertMessage = `⚠️ Alert!\nHeart Rate: ${heart_rate} bpm\nSpO₂: ${spo2}%\nEmail: ${user_email}`;

  await sendEmailAlert(user_email, alertMessage);
  await sendSMSAlert(alertMessage);
  await sendVoiceCall();
}

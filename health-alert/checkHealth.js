require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const { sendSMSAlert } = require('./smsService');
const { sendVoiceCall } = require('./callService');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

let lastCheckedId = null;

async function checkLatestEntry() {
  try {
    const { data, error } = await supabase
      .from('health_data')
      .select('*')
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching latest health data:', error);
      return;
    }

    if (data.length > 0) {
      const latestEntry = data[0];

      if (latestEntry.id !== lastCheckedId) {
        lastCheckedId = latestEntry.id;

        const hr = latestEntry.heart_rate;
        const spo2 = latestEntry.spo2;

        // Trigger alert on first abnormal reading
        if (hr > 100 || hr < 60 || spo2 < 93) {
          const dateObj = new Date(latestEntry.timestampe);
          const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
          const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };
          const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
          const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

          await sendEmailNotification(latestEntry, formattedDate, formattedTime);
          await sendSMSAlert(`🚨 Alert!\nHeart Rate: ${hr} bpm\nSpO2: ${spo2}%\nTime: ${formattedTime} ${formattedDate}`);
          await sendVoiceCall();
        }
      }
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

async function sendEmailNotification(entry, date, time) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ALERT_EMAIL,
    subject: '🚨 Health Alert: Abnormal Reading Detected',
    text: `Abnormal reading detected!\n\n` +
          `❤ Heart Rate: ${entry.heart_rate} bpm\n` +
          `🫁 SpO₂: ${entry.spo2}%\n` +
          `📅 Date: ${date}\n` +
          `⏰ Time: ${time}\n`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Alert email sent!');
  } catch (error) {
    console.error('❌ Error sending email:', error);
  }
}

setInterval(checkLatestEntry, 10000);
console.log('⏳ Monitoring health data for any abnormal reading...');

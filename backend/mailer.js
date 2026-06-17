// import nodemailer from 'nodemailer'
// import dotenv from 'dotenv'

// dotenv.config()

// const SMTP_HOST = process.env.SMTP_HOST
// const SMTP_PORT = process.env.SMTP_PORT
// const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
// const SMTP_USER = process.env.SMTP_USER
// const SMTP_PASS = process.env.SMTP_PASS

// // 🌟 FIX: Forcefully setting authorized SMTP_USER to handle envelope headers
// const FROM_EMAIL = SMTP_USER 

// let transporter = null
// if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
//   transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: parseInt(SMTP_PORT, 10),
//     secure: SMTP_SECURE,
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS,
//     },
//   })
// } else {
//   console.warn('Mailer not configured — emails will be logged to console. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS in env to enable sending.')
// }

// export default async function sendMail({ to, subject, text, html }) {
//   if (!to) throw new Error('Missing `to` address')
//   if (!transporter) {
//     // Fallback: just log the message instead of sending
//     console.log('--- Email (mock) ---')
//     console.log('To:', to)
//     console.log('Subject:', subject)
//     console.log('Text:', text)
//     if (html) console.log('HTML:', html)
//     console.log('--------------------')
//     return { mocked: true }
//   }

//   const info = await transporter.sendMail({
//     from: `"Budget Tracker" <${FROM_EMAIL}>`, // ◄ Auth validated email handle karega mail trigger display
//     replyTo: FROM_EMAIL,
//     to,                                      // ◄ Delivery direct target email (Nandini) par hogi
//     subject,
//     text,
//     html,
//   })

//   return info
// }
import nodemailer from 'nodemailer';

// 🌟 DIRECT HARDCODED CONFIG (Bypassing .env to fix folder path reading issues)
const SMTP_USER = 'agrimasoni.as2005@gmail.com';
const SMTP_PASS = 'yxgaqxavmnymcdru'; 

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

export default async function sendMail({ to, subject, text, html }) {
  if (!to) throw new Error('Missing `to` address');

  console.log(`📡 Sending real email to: ${to}...`);

  try {
    const info = await transporter.sendMail({
      from: `"Budget Tracker" <${SMTP_USER}>`,
      replyTo: SMTP_USER,
      to, 
      subject,
      text,
      html,
    });
    console.log(`✅ Nodemailer Success! MessageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('❌ Nodemailer Error Encountered:', error.message);
    throw error;
  }
}
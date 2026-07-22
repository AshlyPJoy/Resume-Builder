const nodemailer = require('nodemailer');
const sendEmail = async ({email, subject, message}) => {
console.log('Sending email to:', email,subject,message);
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: message
    };
console.log('Mail options:', mailOptions);
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${email}`);
  } catch (err) {
    console.error(`Failed to send email to ${email}: ${err.message}`);
  }
};
module.exports = sendEmail;
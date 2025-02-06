const nodeMailer = require('nodemailer');

require('dotenv').config();

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_MAIL, SMTP_APP_PASS } = process.env;
const sendEmail = async (options, isSend ) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_APP_PASS,
      },
    });

    const mailOptions = {
      from: SMTP_MAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
    isSend = true;

  } catch (err) {
    console.log(err.message)
    isSend = false;
  }

  return isSend;
};

module.exports = sendEmail;

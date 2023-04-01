const nodemailer = require('nodemailer');

module.exports.etherealemail = async function ({ subject, text, html }) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: 'bonita92@ethereal.email',
      pass: 'Y9JxQMTVWmaPTVMt1x',
    },
  });

  const mailOptions = {
    from: 'edgar',
    to: 'bar@example.com',
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const nodemailer=require("nodemailer");

// const transporter = nodemailer.createTransport({
//     service:'gmail',
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure:true,
//     auth: {
//       user: process.env.SMTP_MAIL,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure:false,
    auth: {
      user: "rowland.oberbrunner@ethereal.email",
      pass: "1jKnnuVbSUsbh5TWqq",
    },
  });

module.exports = transporter
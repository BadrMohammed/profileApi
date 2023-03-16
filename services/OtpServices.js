const nodemailer = require("nodemailer");
const MAIL_SETTINGS = {
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(MAIL_SETTINGS);

const sendEmail = async (params) => {
  const { email, OTP } = params;
  debugger;
  try {
    let info = await transporter.sendMail({
      from: "info@enogroup.ae",
      to: email,
      subject: "Hello ✔",
      html: `
          <div
            class="container"
            style="max-width: 90%; margin: auto; padding-top: 20px"
          >
            <h2>Welcome to the club.</h2>
            <h4>You are officially In ✔</h4>
            <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
            <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
       </div>
        `,
    });
    return info;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports = { sendEmail };

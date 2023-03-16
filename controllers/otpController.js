const otpGenerator = require("otp-generator");
const { sendEmail } = require("../services/OtpServices");
const { getUserByKey, updateUser } = require("../services/UserServices");

const OTP_CONFIG = {
  lowerCaseAlphabets: false,
  upperCaseAlphabets: false,
  specialChars: false,
};

const sendVerificationCode = async (req, res) => {
  const { email, phone } = req?.body;
  if (!email && !phone)
    return res
      .status(400)
      .json({ data: null, error: [req.t("email-or-phone-required")] });

  let key = email ? "email" : "mobile";
  let value = email || phone;
  const findUser = await getUserByKey(key, value);
  if (!findUser)
    return res
      .status(409)
      .json({ data: null, error: [req.t("user-not-exist")] });

  try {
    const OTP = otpGenerator.generate(4, OTP_CONFIG);
    let result = null;
    if (email) {
      result = await sendEmail({ email, OTP });
      debugger;
    } else {
      //phone
    }
    if (result) {
      let updatedUser = await updateUser(findUser, { otp: OTP });
      res.status(200).json({
        data: null,
        message: req.t(`confirmation-sent ${email || phone}`),
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: [error.message],
    });
  }
};

const verifiyCode = async (req, res) => {
  const { otp, email, phone } = req?.body;

  if (!otp)
    return res.status(400).json({ data: null, error: [req.t("otp-required")] });

  if (!email && !phone)
    return res
      .status(400)
      .json({ data: null, error: [req.t("email-or-phone-required")] });

  let key = email ? "email" : "mobile";
  let value = email || phone;
  const findUser = await getUserByKey(key, value);
  if (!findUser)
    return res
      .status(409)
      .json({ data: null, error: [req.t("user-not-exist")] });
  try {
    if (findUser.otp === otp) {
      let updatedUser = await updateUser(findUser, { otp: "" });

      res.status(200).json({
        isCorrect: true,
        message: req.t("correct-code"),
      });
    } else {
      res.status(409).json({
        isCorrect: false,
        message: req.t("wrong-code"),
      });
    }
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: [error.message],
    });
  }
};
module.exports = { sendVerificationCode, verifiyCode };

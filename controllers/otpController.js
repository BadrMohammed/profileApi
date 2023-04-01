const otpGenerator = require("otp-generator");
const { sendEmail } = require("../services/OtpServices");
const { getUserByKey, updateUser } = require("../services/UserServices");
const responseMessage = require("../utils/responseMessage");

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
      .json(responseMessage(req.t("email-or-phone-required"), null, 0));

  let key = email ? "email" : "mobile";
  let value = email || phone;
  const findUser = await getUserByKey(key, value);
  if (!findUser)
    return res
      .status(400)
      .json(responseMessage(req.t("user-not-exist"), null, 0));

  try {
    const OTP = otpGenerator.generate(4, OTP_CONFIG);
    let result = null;
    if (email) {
      result = await sendEmail({ email, OTP });
    } else {
      //phone
    }
    if (result) {
      let updatedUser = await updateUser(findUser, { otp: OTP });
      res
        .status(200)
        .json(
          responseMessage(req.t(`confirmation-sent ${email || phone}`), null, 1)
        );
    }
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const verifiyCode = async (req, res) => {
  const { otp, email, phone } = req?.body;

  if (!otp)
    return res
      .status(400)
      .json(responseMessage(req.t("otp-required"), null, 0));

  if (!email && !phone)
    return res
      .status(400)
      .json(responseMessage(req.t("email-or-phone-required"), null, 0));

  let key = email ? "email" : "mobile";
  let value = email || phone;
  const findUser = await getUserByKey(key, value);
  if (!findUser)
    return res
      .status(400)
      .json(responseMessage(req.t("user-not-exist"), null, 0));
  try {
    if (findUser.otp === otp) {
      let updatedUser = await updateUser(findUser, { otp: "" });

      res.status(200).json(responseMessage(req.t("correct-code"), null, 1));
    } else {
      res.status(409).json(responseMessage(req.t("wrong-code"), null, 0));
    }
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};
module.exports = { sendVerificationCode, verifiyCode };

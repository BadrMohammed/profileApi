const bcrypt = require("bcrypt");
const {
  getUserByKey,
  createUser,
  updateUser,
} = require("../../services/UserServices");

const createToken = require("../../sharedFunctions/createToken");
const responseMessage = require("../../utils/responseMessage");
const register = async (req, res) => {
  const { email, password, permissions, addresses } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json(responseMessage(req.t("email-password-required"), null, 0));

  if (permissions) {
    delete req?.body?.permissions;
  }
  if (password.length < 8 || password.length > 14)
    return res
      .status(400)
      .json(responseMessage(req.t("password-length-validation"), null, 0));
  const dublictedEmail = await getUserByKey("email", email);
  //   check for duplicate email
  if (dublictedEmail)
    return res.status(409).json(responseMessage(req.t("email-exist"), null, 0));

  if (addresses?.length) {
    let findHasMoreDefault = addresses.filter((add) => add.isDefault);
    if (findHasMoreDefault.length > 1) {
      return res
        .status(400)
        .json(responseMessage(req.t("more-than-one-default-address"), null, 0));
    }
  }
  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await createUser(req?.body, hashedPassword, 1);
    res.status(200).json(responseMessage(req.t("account-created"), result, 1));
  } catch (error) {
    let message = req.t("invalid-email");

    return res.status(500).json(responseMessage(message, null, 0));
  }
};

const verifiyUser = async (req, res) => {
  const { userId, isVerified, permissions } = req.body;

  if (!isVerified || !userId) {
    return res
      .status(400)
      .json(responseMessage(req.t("userId-isVerified-required"), null, 0));
  }

  const findUser = await getUserByKey("_id", userId);
  if (!findUser)
    return res
      .status(409)
      .json(responseMessage(req.t("user-not-exist"), null, 0));

  if (findUser?.isVerified)
    return res
      .status(406)
      .json(responseMessage(req.t("user-verified-before"), null, 0));

  try {
    const token = createToken(userId, permissions);
    const result = await updateUser(findUser, req?.body, token);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
    });
    res
      .status(200)
      .json(responseMessage(req.t("verified-successfully"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json(responseMessage(req.t("email-password-required"), null, 0));

  const findUser = await getUserByKey("email", email);
  if (!findUser)
    return res
      .status(400)
      .json(responseMessage(req.t("user-not-exist"), null, 0));

  const matchedPassword = await bcrypt.compare(password, findUser.password);

  if (!matchedPassword)
    return res
      .status(400)
      .json(responseMessage(req.t("incorrect-password"), null, 0));
  if (!findUser.isVerified) {
    return res
      .status(200)
      .json(responseMessage(req.t("not-verified"), findUser, 1));
  }
  try {
    const token = createToken(findUser._id, findUser.permissions);
    const result = await updateUser(findUser, req?.body, token);
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
    });
    res
      .status(200)
      .json(responseMessage(req.t("Logged-successfully"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword, email } = req.body;

  if (!newPassword || !confirmPassword)
    return res
      .status(400)
      .json(
        responseMessage(req.t("password-confirmPassword-required"), null, 0)
      );

  if (newPassword !== confirmPassword)
    return res
      .status(400)
      .json(
        responseMessage(req.t("password-confirmPassword-not-match"), null, 0)
      );

  const findUser = await getUserByKey("email", email);

  if (!findUser)
    return res
      .status(400)
      .json(responseMessage(req.t("user-not-exist"), null, 0));

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    findUser.password = hashedPassword;
    const result = await updateUser(findUser, req?.body);

    if (result)
      res
        .status(200)
        .json(responseMessage(req.t("password-updated-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { register, verifiyUser, login, resetPassword };

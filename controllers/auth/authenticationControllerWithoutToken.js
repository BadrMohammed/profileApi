const bcrypt = require("bcrypt");
const {
  getUserByKey,
  createUser,
  updateUser,
} = require("../../services/UserServices");

const createToken = require("../../sharedFunctions/createToken");

const register = async (req, res) => {
  const { email, password, permissions, addresses } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ data: null, error: [req.t("email-password-required")] });

  if (permissions) {
    delete req?.body?.permissions;
  }
  if (password.length < 8 || password.length > 14)
    return res.status(400).json({
      data: null,
      error: [req.t("password-length-validation")],
    });
  const dublictedEmail = await getUserByKey("email", email);
  //   check for duplicate email
  if (dublictedEmail)
    return res.status(409).json({ data: null, error: [req.t("email-exist")] });

  if (addresses?.length) {
    let findHasMoreDefault = addresses.filter((add) => add.isDefault);
    if (findHasMoreDefault.length > 1) {
      return res
        .status(400)
        .json({ data: null, error: [req.t("more-than-one-default-address")] });
    }
  }
  try {
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await createUser(req?.body, hashedPassword, 1);
    res.status(200).json({ data: result, message: req.t("account-created") });
  } catch (error) {
    let message = req.t("invalid-email");

    return res.status(500).json({ data: null, error: [message] });
  }
};

const verifiyUser = async (req, res) => {
  const { userId, isVerified, permissions } = req.body;

  if (!isVerified || !userId) {
    return res
      .status(400)
      .json({ data: null, error: [req.t("userId-isVerified-required")] });
  }

  const findUser = await getUserByKey("_id", userId);
  if (!findUser)
    return res
      .status(409)
      .json({ data: null, error: [req.t("user-not-exist")] });

  if (findUser?.isVerified)
    return res
      .status(406)
      .json({ data: null, error: [req.t("user-verified-before")] });

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
      .json({ data: result, message: req.t("verified-successfully") });
  } catch (error) {
    return res.status(500).json({ data: null, error: [error.message] });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ data: null, error: [req.t("email-password-required")] });

  const findUser = await getUserByKey("email", email);
  if (!findUser)
    return res
      .status(409)
      .json({ data: null, error: [req.t("user-not-exist")] });

  const matchedPassword = await bcrypt.compare(password, findUser.password);

  if (!matchedPassword)
    return res
      .status(409)
      .json({ data: null, error: [req.t("incorrect-password")] });
  if (!findUser.isVerified) {
    return res
      .status(200)
      .json({ data: findUser, message: req.t("not-verified") });
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
      .json({ data: result, message: req.t("Logged-successfully") });
  } catch (error) {
    return res.status(500).json({ data: null, error: [error.message] });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, confirmPassword, email } = req.body;

  if (!newPassword || !confirmPassword)
    return res.status(400).json({
      data: null,
      error: [req.t("password-confirmPassword-required")],
    });

  if (newPassword !== confirmPassword)
    return res.status(403).json({
      data: null,
      error: [req.t("password-confirmPassword-not-match")],
    });

  const findUser = await getUserByKey("email", email);

  if (!findUser)
    return res
      .status(409)
      .json({ data: null, error: [req.t("user-not-exist")] });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    findUser.password = hashedPassword;
    const result = await updateUser(findUser, req?.body);

    if (result)
      res.status(200).json({ message: req.t("password-updated-successfully") });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { register, verifiyUser, login, resetPassword };

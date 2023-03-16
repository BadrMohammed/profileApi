const bcrypt = require("bcrypt");
const {
  getUserByKey,
  createUser,
  getUsers,
  updateUser,
} = require("../services/UserServices");

const getAllUsers = async (req, res) => {
  const result = await getUsers(req?.query, res.locals.language);

  let data = result?.docs.map((user) => {
    let newUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      addresses: user.addresses,
      email: user.email,
      permissions: user?.permissions,
      mobile: user.mobile,
      birthDate: user.birthDate,
      isVerified: user.isVerified,
      userType: user.userType,
    };

    return newUser;
  });
  const pagination = {
    counts: result.counts,
    currentPage: result.currentPage,
    perPage: result.perPage,
    totalPages: result.totalPages,
  };

  return res.status(200).json({ data, pagination, message: "" });
};

const addUser = async (req, res) => {
  const { email, password, addresses } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json({ data: null, error: [req.t("email-password-required")] });

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
    const result = await createUser(req?.body, hashedPassword, 0);

    res.status(200).json({ data: result, message: req.t("user-created") });
  } catch (error) {
    let message = req.t("invalid-email");

    return res.status(500).json({
      data: null,
      error: [message],
    });
  }
};

const editUser = async (req, res) => {
  const { id, addresses } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  if (addresses?.length) {
    let findHasMoreDefault = addresses.filter((add) => add.isDefault);
    if (findHasMoreDefault.length > 1) {
      return res
        .status(400)
        .json({ data: null, error: [req.t("more-than-one-default-address")] });
    }
  }
  try {
    const findUser = await getUserByKey("_id", id);
    const result = await updateUser(findUser, req?.body);

    res.status(200).json({ data: result, message: req.t("item-updated") });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: [error.message],
    });
  }
};

const getUserById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  const result = await getUserByKey("_id", id);
  res.status(200).json({ data: result, message: "" });
};

module.exports = { getAllUsers, getUserById, addUser, editUser };

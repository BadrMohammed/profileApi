const bcrypt = require("bcrypt");
const {
  getUserByKey,
  createUser,
  getUsers,
  updateUser,
} = require("../services/UserServices");
const responseMessage = require("../utils/responseMessage");

const getAllUsers = async (req, res) => {
  try {
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

    return res.status(200).json(responseMessage("", data, 1, pagination));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const addUser = async (req, res) => {
  const { email, password, addresses } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json(responseMessage(req.t("email-password-required"), null, 0));

  if (password.length < 8 || password.length > 14)
    return res
      .status(400)
      .json(responseMessage(req.t("password-length-validation"), null, 0));
  const dublictedEmail = await getUserByKey("email", email);
  //   check for duplicate email
  if (dublictedEmail)
    return res.status(400).json(responseMessage(req.t("email-exist"), null, 0));

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
    const result = await createUser(req?.body, hashedPassword, 0);

    res.status(200).json(responseMessage(req.t("user-created"), result, 1));
  } catch (error) {
    let message = req.t("invalid-email");

    return res.status(500).json(responseMessage(message, null, 0));
  }
};

const editUser = async (req, res) => {
  const { id, addresses } = req.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  if (addresses?.length) {
    let findHasMoreDefault = addresses.filter((add) => add.isDefault);
    if (findHasMoreDefault.length > 1) {
      return res
        .status(400)
        .json(responseMessage(req.t("more-than-one-default-address"), null, 0));
    }
  }
  try {
    const findUser = await getUserByKey("_id", id);
    const result = await updateUser(findUser, req?.body);

    res.status(200).json(responseMessage(req.t("item-updated"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const getUserById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  const result = await getUserByKey("_id", id);
  res.status(200).json(responseMessage("", result, 1));
};

module.exports = { getAllUsers, getUserById, addUser, editUser };

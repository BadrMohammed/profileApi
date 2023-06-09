const bcrypt = require("bcrypt");
const {
  getUserByKey,
  createUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../services/UserServices");
const responseMessage = require("../utils/responseMessage");

const getAllUsers = async (req, res) => {
  try {
    const result = await getUsers(req?.query, res.locals.language);
    const pagination = {
      counts: result.counts,
      currentPage: result.currentPage,
      perPage: result.perPage,
      totalPages: result.totalPages,
    };

    return res
      .status(200)
      .json(responseMessage("", result?.docs, 1, pagination));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const addUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res
      .status(400)
      .json(responseMessage(req.t("email-password-required"), null, 0));

  if (password.length < 8 || password.length > 14)
    return res
      .status(400)
      .json(responseMessage(req.t("password-length-validation"), null, 0));
  const dublictedEmail = await getUserByKey("email", email);
  if (dublictedEmail)
    return res.status(400).json(responseMessage(req.t("email-exist"), null, 0));

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
  const { id, password } = req?.body;
  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));
  try {
    const findUser = await getUserByKey("_id", id);
    if (!findUser)
      return res
        .status(400)
        .json(responseMessage(req.t("item-not-exist"), null, 0));

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await updateUser(findUser, req?.body, hashedPassword);

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

  try {
    const result = await getUserByKey("_id", id);
    if (!result)
      return res
        .status(400)
        .json(responseMessage(req.t("item-not-exist"), null, 0));
    res.status(200).json(responseMessage("", result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};
const removeUser = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  let findItem = await getUserByKey("_id", id);
  if (!findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-not-exist"), null, 0));

  try {
    const result = await deleteUser(id);
    res
      .status(200)
      .json(responseMessage(req.t("item-deleted-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getAllUsers, getUserById, addUser, editUser, removeUser };

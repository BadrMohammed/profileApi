const User = require("../models/UserModel");
const paginationOptions = require("../enums/paginationOptions");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");
const getUsers = async (params, locale) => {
  const {
    perPage = 10,
    page = 1,
    email,
    id,
    jopType,
    fullName,
    createdAt,
    phoneNumber,
  } = params;
  const options = {
    limit: perPage,
    page,
    customLabels: paginationOptions,
    collation: {
      locale: locale,
    },
    sort: { createdAt: -1 },
  };
  let query = {
    email: email && { $regex: new RegExp(email, "i") },
    jopType: jopType && jopType,
    _id: id && id,
    createdAt: createdAt && createdAt,
    fullName: fullName && { $regex: new RegExp(fullName, "i") },
    phoneNumber: phoneNumber && phoneNumber,
  };
  query = removeUnsetValues(query);

  const entry = await User.paginate(query, options);
  return entry;
};
const getUserByKey = async (key, value) => {
  const entry = await User.findOne({ [key]: value }).exec();

  return entry;
};

const createUser = async (formBody, hashedPassword) => {
  const entry = await User.create({
    fullName: formBody.fullName,
    email: formBody.email,
    password: hashedPassword,
    phoneNumber: formBody.phoneNumber,
    jopType: formBody.jopType,
  });
  return entry;
};

const updateUser = async (user, formBody) => {
  const entry = user;
  if (formBody.fullName) entry.fullName = formBody.fullName;
  if (formBody.email) entry.email = formBody.email;
  if (formBody.password) entry.password = formBody.password;
  if (formBody.phoneNumber) entry.phoneNumber = formBody.phoneNumber;
  if (formBody.jopType) entry.jopType = formBody.jopType;

  const result = await entry.save();

  return result;
};

module.exports = { getUsers, createUser, updateUser, getUserByKey };

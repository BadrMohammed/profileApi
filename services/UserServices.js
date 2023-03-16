const User = require("../models/UserModel");
const paginationOptions = require("../enums/paginationOptions");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");
const getUsers = async (params, locale) => {
  const {
    perPage = 4,
    page = 1,
    email,
    id,
    userType,
    name,
    createdAt,
    isVerified,
    mobile,
    countryId,
  } = params;
  const options = {
    limit: perPage,
    page,
    customLabels: paginationOptions,
    collation: {
      locale: locale,
    },
    sort: { createdAt: -1 },
    populate: [
      {
        path: "addresses.country",
        select: `id ${locale === "en" ? "nameEn" : "nameAr"}`,
        match: { _id: countryId ? countryId : undefined },
      },
      {
        path: "addresses.city",
        select: `_id ${locale === "en" ? "nameEn" : "nameAr"}`,
        match: { _id: countryId ? countryId : undefined },
      },
      {
        path: "addresses.area",
        select: `_id ${locale === "en" ? "nameEn" : "nameAr"}`,
        match: { _id: countryId ? countryId : undefined },
      },
    ],
  };
  let query = {
    email: email && { $regex: new RegExp(email, "i") },
    userType: userType && userType,
    _id: id && id,
    createdAt: createdAt && createdAt,
    firstName: name && { $regex: new RegExp(name, "i") },
    lastName: name && { $regex: new RegExp(name, "i") },
    isVerified: isVerified && isVerified,
    mobile: mobile && mobile,
  };
  query = removeUnsetValues(query);

  const entry = await User.paginate(query, options);
  return entry;
};
const getUserByKey = async (key, value) => {
  const entry = await User.findOne({ [key]: value }).exec();

  return entry;
};

function prepareUser(user) {
  return user

    .populate([
      {
        path: "addresses.country",
      },
      {
        path: "addresses.city",
      },
      {
        path: "addresses.area",
      },
    ])

    .then((res) => {
      let newResult = {
        firstName: res.firstName,
        lastName: res.lastName,
        addresses: res.addresses,
        email: res.email,
        password: res.password,
        mobile: res.mobile,
        birthDate: res.birthDate,
        isVerified: res.isVerified,
        token: res.token,
        userType: res.userType,
        _id: res._id,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        permissions: res?.permissions,
      };
      return newResult;
    });
}

const createUser = async (formBody, hashedPassword, userType) => {
  const entry = await User.create({
    firstName: formBody.firstName,
    lastName: formBody.lastName,
    password: hashedPassword,
    addresses: formBody.addresses,
    email: formBody.email,
    mobile: formBody.mobile,
    birthDate: formBody.birthDate,
    isVerified: userType === 1 ? false : true,
    token: "",
    userType: userType,
    permissions: userType === 0 ? formBody?.permissions : undefined,
  }).then(prepareUser);
  return entry;
};

const updateUser = async (user, formBody, token) => {
  const entry = user;
  if (formBody.firstName) entry.firstName = formBody.firstName;
  if (formBody.lastName) entry.lastName = formBody.lastName;
  if (formBody.addresses) entry.addresses = formBody.addresses;
  if (formBody.email) entry.email = formBody.email;
  if (formBody.mobile) entry.mobile = formBody.mobile;
  if (formBody.birthDate) entry.birthDate = formBody.birthDate;
  if (formBody.isVerified) entry.isVerified = formBody.isVerified;
  if (token !== undefined) entry.token = token;
  if (formBody.userType) entry.userType = formBody.userType;
  if (formBody.permissions) entry.permissions = formBody.permissions;
  if (formBody.otp !== undefined) entry.otp = formBody.otp;

  const result = await entry.save().then(prepareUser);

  return result;
};

module.exports = { getUsers, createUser, updateUser, getUserByKey };

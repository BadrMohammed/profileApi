const paginationOptions = require("../enums/paginationOptions");
const Country = require("../models/CountryModel");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");

const getCountries = async (params, locale) => {
  const { perPage = 4, page = 1, id, name, createdAt, userId } = params;
  const options = {
    limit: perPage,
    page,
    customLabels: paginationOptions,
    collation: {
      locale: locale,
    },
    sort: { createdAt: -1 },
    populate: {
      path: "userId",
      select: "_id firstName lastName",
      match: { _id: userId ? userId : undefined },
    },
  };
  let query = {
    _id: id && id,
    createdAt: createdAt && createdAt,
    nameEn:
      locale === "en" ? name && { $regex: new RegExp(name, "i") } : undefined,
    nameAr:
      locale === "ar" ? name && { $regex: new RegExp(name, "i") } : undefined,
  };
  query = removeUnsetValues(query);

  const entry = await Country.paginate(query, options);
  return entry;
};

const getCountryByKey = async (key, value) => {
  const entry = await Country.findOne({ [key]: value }).exec();

  return entry;
};
function prepareCountry(country) {
  return country

    .populate([
      {
        path: "userId",
        select: "_id firstName lastName",
      },
    ])

    .then((res) => {
      let newResult = {
        id: res._id,
        nameEn: res.nameEn,
        nameAr: res.nameAr,
        user: res.userId,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      return newResult;
    });
}

const createCountry = async (formBody, userId) => {
  const entry = await Country.create({
    nameEn: formBody.nameEn,
    nameAr: formBody.nameAr,
    userId: userId,
  }).then(prepareCountry);
  return entry;
};

const updateCountry = async (country, formBody, userId) => {
  const entry = country;
  if (formBody.nameEn) entry.nameEn = formBody.nameEn;
  if (formBody.nameAr) entry.nameAr = formBody.nameAr;
  if (userId) entry.userId = userId;

  const result = await entry.save().then(prepareUser);

  return result;
};
module.exports = {
  getCountries,
  createCountry,
  updateCountry,
  getCountryByKey,
};

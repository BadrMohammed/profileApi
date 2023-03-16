const paginationOptions = require("../enums/paginationOptions");
const City = require("../models/CityModel");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");

const getCities = async (params, locale) => {
  const {
    perPage = 4,
    page = 1,
    id,
    name,
    createdAt,
    userId,
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
        path: "userId",
        select: "_id firstName lastName",
        match: { _id: userId ? userId : undefined },
      },
      {
        path: "countryId",
        select: `_id ${locale === "en" ? "nameEn" : "nameAr"}`,
        match: { _id: countryId ? countryId : undefined },
      },
    ],
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

  const entry = await City.paginate(query, options);
  return entry;
};

const getCityByKey = async (key, value) => {
  const entry = await City.findOne({ [key]: value }).exec();

  return entry;
};

function prepareCity(city) {
  return city

    .populate([
      {
        path: "userId",
        select: "_id firstName lastName",
      },
      {
        path: "countryId",
        select: "_id nameEn nameAr",
      },
    ])

    .then((res) => {
      let newResult = {
        nameEn: res.nameEn,
        nameAr: res.nameAr,
        user: res.userId,
        country: res.countryId,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      return newResult;
    });
}

const createCity = async (formBody, userId) => {
  const entry = await City.create({
    nameEn: formBody.nameEn,
    nameAr: formBody.nameAr,
    countryId: formBody.countryId,
    userId: userId,
  }).then(prepareCity);
  return entry;
};

const updateCity = async (city, formBody, userId) => {
  const entry = city;
  if (formBody.nameEn) entry.nameEn = formBody.nameEn;
  if (formBody.nameAr) entry.nameAr = formBody.nameAr;
  if (formBody.countryId) entry.countryId = formBody.countryId;
  if (userId) entry.userId = userId;

  const result = await entry.save().then(prepareCity);

  return result;
};
module.exports = {
  getCities,
  createCity,
  updateCity,
  getCityByKey,
};

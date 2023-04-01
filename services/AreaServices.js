const paginationOptions = require("../enums/paginationOptions");
const Area = require("../models/AreaModel");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");

const getAreas = async (params, locale) => {
  const { perPage = 4, page = 1, id, name, createdAt, userId, cityId } = params;
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
        path: "cityId",
        select: `_id ${locale === "en" ? "nameEn" : "nameAr"}`,
        match: { _id: cityId ? cityId : undefined },
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

  const entry = await Area.paginate(query, options);
  return entry;
};

const getAreaByKey = async (key, value) => {
  const entry = await Area.findOne({ [key]: value }).exec();

  return entry;
};

function prepareArea(area) {
  return area

    .populate([
      {
        path: "userId",
        select: "_id firstName lastName",
      },
      {
        path: "cityId",
        select: "_id nameEn nameAr",
      },
    ])

    .then((res) => {
      let newResult = {
        id: res._id,
        nameEn: res.nameEn,
        nameAr: res.nameAr,
        user: res.userId,
        city: res.cityId,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      return newResult;
    });
}

const createArea = async (formBody, userId) => {
  const entry = await Area.create({
    nameEn: formBody.nameEn,
    nameAr: formBody.nameAr,
    cityId: formBody.cityId,
    userId: userId,
  }).then(prepareArea);
  return entry;
};

const updateArea = async (area, formBody, userId) => {
  const entry = area;
  if (formBody.nameEn) entry.nameEn = formBody.nameEn;
  if (formBody.nameAr) entry.nameAr = formBody.nameAr;
  if (formBody.cityId) entry.cityId = formBody.cityId;
  if (userId) entry.userId = userId;

  const result = await entry.save().then(prepareArea);

  return result;
};
module.exports = {
  getAreas,
  createArea,
  updateArea,
  getAreaByKey,
};

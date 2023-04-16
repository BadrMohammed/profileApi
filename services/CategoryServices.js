const paginationOptions = require("../enums/paginationOptions");
const Category = require("../models/CategoryModel");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");

const getCategories = async (params, locale) => {
  const {
    perPage = 4,
    page = 1,
    id,
    name,
    createdAt,
    userId,
    categoryId,
    isHome,
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
        path: "parent",
        select: `_id image ${
          locale === "en" ? "nameEn descriptionEn" : "nameAr descriptionAr"
        }`,
        match: { _id: categoryId ? categoryId : undefined },
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
    parent: categoryId && categoryId,
    isHome: isHome && isHome,
  };
  query = removeUnsetValues(query);

  const entry = await Category.paginate(query, options);
  return entry;
};

const getCategoryByKey = async (key, value) => {
  const entry = await Category.findOne({ [key]: value }).exec();

  return entry;
};

function prepareCategory(category) {
  return category

    .populate([
      {
        path: "userId",
        select: "_id firstName lastName",
      },
      {
        path: "parent",
        select: "_id image nameEn nameAr descriptionEn descriptionAr",
      },
    ])

    .then((res) => {
      let newResult = {
        id: res._id,
        image: res.image,
        nameEn: res.nameEn,
        nameAr: res.nameAr,
        descriptionEn: res.descriptionEn,
        descriptionAr: res.descriptionAr,
        user: res.userId,
        parent: res.parent,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
        isHome: res.isHome,
      };
      return newResult;
    });
}

const createCategory = async (formBody, userId, img) => {
  const entry = await Category.create({
    image: img || undefined,
    nameEn: formBody.nameEn,
    nameAr: formBody.nameAr,
    descriptionEn: formBody.descriptionEn,
    descriptionAr: formBody.descriptionAr,
    parent: formBody.parent,
    userId: userId,
    isHome: isHome,
  }).then(prepareCategory);
  return entry;
};

const updateCategory = async (category, formBody, userId, img) => {
  const entry = category;
  if (img) entry.image = img;
  if (formBody.nameEn) entry.nameEn = formBody.nameEn;
  if (formBody.nameAr) entry.nameAr = formBody.nameAr;
  if (formBody.descriptionEn) entry.nameEn = formBody.descriptionEn;
  if (formBody.descriptionAr) entry.nameAr = formBody.descriptionAr;
  if (formBody.parent) entry.parent = formBody.parent;
  if (userId) entry.userId = userId;
  if (isHome) entry.isHome = isHome;

  const result = await entry.save().then(prepareCategory);

  return result;
};
module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  getCategoryByKey,
};

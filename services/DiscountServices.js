const paginationOptions = require("../enums/paginationOptions");
const Discount = require("../models/DiscountModel");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");

const getDiscounts = async (params, locale) => {
  const {
    perPage = 4,
    page = 1,
    id,
    createdAt,
    userId,
    isCategory,
    allCategories,
    isValid,
    discount,
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
    ],
  };
  let query = {
    _id: id && id,
    createdAt: createdAt && createdAt,
    isCategory: isCategory && isCategory,
    allCategories: allCategories && allCategories,
    isValid: isValid && isValid,
    discount: discount && discount,
  };
  query = removeUnsetValues(query);

  const entry = await Discount.paginate(query, options);
  return entry;
};

const getSortedDiscounts = async (params, locale) => {
  const { perPage = 10, page = 1 } = params;
  const options = {
    limit: perPage,
    pagination: false,

    page,
    customLabels: paginationOptions,
    collation: {
      locale: locale,
    },
    sort: { discount: -1 },
    // populate: [
    //   {
    //     path: "userId",
    //     select: "_id firstName lastName",
    //   },
    // ],
  };
  let query = {
    isValid: true,
    isCategory: true,
  };
  query = removeUnsetValues(query);

  const entry = await Discount.paginate(query, options);
  return entry;
};

const getDiscountByKey = async (key, value, regular) => {
  let entry = null;

  if (regular) {
    entry = await Discount.findOne({ [key]: value })
      .lean()
      .exec();
  } else {
    entry = await Discount.findOne({ [key]: value }).exec();
  }
  return entry;
};

const getDiscountByParams = async (params, regular) => {
  let entry = null;
  if (regular) {
    entry = await Discount.find(params).lean().exec();
  } else {
    entry = await Discount.find(params).exec();
  }
  return entry;
};

const createDiscount = async (formBody, userId, img) => {
  const entry = await Discount.create({
    image: img || undefined,
    discount: formBody.discount,
    allCategories: formBody.allCategories,
    isCategory: formBody.isCategory,
    categoryIds: formBody.categoryIds,
    validDate: formBody.validDate,
    isValid: formBody.isValid,
    userId: userId,
  });
  return entry;
};

const updateDiscount = async (item, formBody, userId, img, isValid) => {
  const entry = item;
  if (formBody.discount) entry.discount = formBody.discount;
  if (formBody.isPercentage) entry.isPercentage = formBody.isPercentage;
  if (formBody.allCategories) entry.allCategories = formBody.allCategories;
  if (formBody.isCategory) entry.isCategory = formBody.isCategory;
  if (formBody.categoryIds) entry.categoryIds = formBody.categoryIds;
  if (isValid !== undefined && isValid !== null) entry.isValid = isValid;
  if (userId) entry.userId = userId;
  if (img) entry.image = img;

  const result = await entry.save();

  return result;
};
module.exports = {
  getDiscounts,
  createDiscount,
  updateDiscount,
  getDiscountByKey,
  getDiscountByParams,
  getSortedDiscounts,
};

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
    isCategories,
    isProducts,
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
    isCategories: isCategories && isCategories,
    isProducts: isProducts && isProducts,
    allCategories: allCategories && allCategories,
    isValid: isValid && isValid,
    discount: discount && discount,
  };
  query = removeUnsetValues(query);

  const entry = await Discount.paginate(query, options);
  return entry;
};

const getDiscountByKey = async (key, value) => {
  const entry = await Discount.findOne({ [key]: value }).exec();

  return entry;
};

const createDiscount = async (formBody, userId) => {
  const entry = await Discount.create({
    discount: formBody.discount,
    isPercentage: formBody.isPercentage,
    allCategories: formBody.allCategories,
    isCategories: formBody.isCategories,
    isProducts: formBody.isProducts,
    categoryIds: formBody.categoryIds,
    productIds: formBody.productIds,
    validDate: formBody.validDate,
    isValid: formBody.isValid,
    userId: userId,
  });
  return entry;
};

const updateDiscount = async (item, formBody, userId) => {
  const entry = item;
  if (formBody.discount) entry.discount = formBody.discount;
  if (formBody.isPercentage) entry.isPercentage = formBody.isPercentage;
  if (formBody.allCategories) entry.allCategories = formBody.allCategories;
  if (formBody.isCategories) entry.isCategories = formBody.isCategories;
  if (formBody.isProducts) entry.isProducts = formBody.isProducts;
  if (formBody.categoryIds) entry.categoryIds = formBody.categoryIds;
  if (formBody.productIds) entry.productIds = formBody.productIds;
  if (formBody.isValid) entry.isValid = formBody.isValid;
  if (userId) entry.userId = userId;

  const result = await entry.save();

  return result;
};
module.exports = {
  getDiscounts,
  createDiscount,
  updateDiscount,
  getDiscountByKey,
};

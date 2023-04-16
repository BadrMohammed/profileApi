const paginationOptions = require("../enums/paginationOptions");
const Product = require("../models/ProductModel");
const removeUnsetValues = require("../sharedFunctions/removeUnsetValues");

const getProducts = async (params, locale) => {
  const {
    perPage = 4,
    page = 1,
    id,
    name,
    createdAt,
    userId,
    categoryId,
    countryId,
    price,
    // range,
    color,
    quantity,
    categoryIds,
  } = params;
  const options = {
    limit: perPage,
    page,
    customLabels: paginationOptions,
    lean: true,
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
        path: "categoryId",
        select: `_id image ${
          locale === "en" ? "nameEn descriptionEn" : "nameAr descriptionAr"
        }`,
        match: { _id: categoryId ? categoryId : undefined },
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
    categoryId: categoryId && categoryId,
    countryId: countryId && countryId,
    price: price && price,
    color: color && color,
    quantity: quantity && quantity,
    categoryId: categoryIds && { $in: categoryIds },
  };
  query = removeUnsetValues(query);

  const entry = await Product.paginate(query, options);

  return entry;
};

const getProductByKey = async (key, value, regular) => {
  let entry = null;
  if (regular) {
    entry = await Product.findOne({ [key]: value })
      .lean()
      .exec();
  } else {
    entry = await Product.findOne({ [key]: value }).exec();
  }

  return entry;
};

function prepareProduct(product) {
  return product

    .populate([
      {
        path: "userId",
        select: "_id firstName lastName",
      },
      {
        path: "categoryId",
        select: "_id image nameEn nameAr descriptionEn descriptionAr",
      },
      {
        path: "countryId",
        select: "_id nameEn nameAr",
      },
    ])

    .then((res) => {
      let newResult = {
        id: res._id,
        images: res.images,
        nameEn: res.nameEn,
        nameAr: res.nameAr,
        descriptionEn: res.descriptionEn,
        descriptionAr: res.descriptionAr,
        userId: res.userId,
        categoryId: res.categoryId,
        countryId: res.countryId,
        color: res.color,
        price: res.price,
        oldPrice: res.oldPrice,
        specifications: res.specifications,
        quantity: res.quantity,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      return newResult;
    });
}

const createProduct = async (formBody, userId, images) => {
  const entry = await Product.create({
    images: images || undefined,
    nameEn: formBody.nameEn,
    nameAr: formBody.nameAr,
    descriptionEn: formBody.descriptionEn,
    descriptionAr: formBody.descriptionAr,
    userId: userId,
    categoryId: formBody.categoryId,
    countryId: formBody.countryId,
    specifications: formBody.specifications,
    price: formBody.price,
    oldPrice: null,
    color: formBody.color,
    quantity: formBody.quantity,
  }).then(prepareProduct);
  return entry;
};

const updateProduct = async (product, formBody, userId, images, oldPrice) => {
  const entry = product;
  if (images) entry.images = images;
  if (userId) entry.userId = userId;
  if (oldPrice) entry.oldPrice = oldPrice;
  if (formBody) {
    if (formBody.nameEn) entry.nameEn = formBody.nameEn;
    if (formBody.nameAr) entry.nameAr = formBody.nameAr;
    if (formBody.descriptionEn) entry.nameEn = formBody.descriptionEn;
    if (formBody.descriptionAr) entry.nameAr = formBody.descriptionAr;
    if (formBody.categoryId) entry.categoryId = formBody.categoryId;
    if (formBody.countryId) entry.countryId = formBody.countryId;
    if (formBody.specifications) entry.specifications = formBody.specifications;
    if (formBody.color) entry.color = formBody.color;
    if (formBody.price) entry.price = formBody.price;
    if (formBody.quantity) entry.quantity = formBody.quantity;
  }
  const result = await entry.save().then(prepareProduct);

  return result;
};
module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  getProductByKey,
};

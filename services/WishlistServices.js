const Wishlist = require("../models/WishlistModel");
const paginationOptions = require("../enums/paginationOptions");

const getWishlist = async (params, userId, locale) => {
  const { perPage = 4, page = 1, productId } = params;
  const options = {
    limit: perPage,
    page,
    customLabels: paginationOptions,
    collation: {
      locale: locale,
    },
    lean: true,
    sort: { createdAt: -1 },
    populate: [
      {
        path: "userId",
        select: "_id firstName lastName",
        match: { _id: userId ? userId : undefined },
      },
      {
        path: "productId",
        select: `_id images categoryId ${
          locale === "en" ? "nameEn descriptionEn" : "nameAr descriptionAr"
        } price oldPrice color quantity`,
      },
    ],
  };
  let query = {
    userId: userId && userId,
  };
  const entry = await Wishlist.paginate(query, options);
  return entry;
};

function prepareWishlist(cart) {
  return cart

    .populate([
      {
        path: "userId",
        select: "_id firstName lastName",
      },
      {
        path: "productId",
        select:
          "_id images nameEn descriptionEn nameAr descriptionAr price oldPrice color quantity",
      },
    ])

    .then((res) => {
      let newResult = {
        id: res._id,
        user: res.userId,
        product: res.productId,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      return newResult;
    });
}

const createWishlist = async (formBody, userId) => {
  const entry = await Wishlist.create({
    productId: formBody.productId,
    userId: userId,
  }).then(prepareWishlist);
  return entry;
};

const deleteWishlist = async (id) => {
  const result = await Wishlist.deleteOne({ _id: id });
  return result;
};

const getWishlistByKey = async (key, value, regular) => {
  let entry = null;
  if (regular) {
    entry = await Wishlist.findOne({ [key]: value })
      .lean()
      .exec();
  } else {
    entry = await Wishlist.findOne({ [key]: value }).exec();
  }
  return entry;
};

const getMultipleWishlistByKey = async (key, values) => {
  const entry = await Wishlist.find().where(key).in(values).lean().exec();
  return entry;
};

module.exports = {
  getWishlist,
  getWishlistByKey,
  createWishlist,
  deleteWishlist,
  getMultipleWishlistByKey,
};

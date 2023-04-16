const Cart = require("../models/CartModel");

const getCart = async (userId, locale) => {
  const options = {
    pagination: false,
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
  const entry = await Cart.paginate(query, options);
  return entry;
};

function prepareCart(cart) {
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
        quantity: res.quantity,
        user: res.userId,
        product: res.productId,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      return newResult;
    });
}

const createCart = async (formBody, userId) => {
  const entry = await Cart.create({
    productId: formBody.productId,
    quantity: formBody.quantity,
    userId: userId,
  }).then(prepareCart);
  return entry;
};

const deleteCart = async (id) => {
  const result = await Cart.deleteOne({ _id: id });
  return result;
};

const getCartByKey = async (key, value) => {
  const entry = await Cart.findOne({ [key]: value }).exec();

  return entry;
};

module.exports = {
  getCart,
  getCartByKey,
  createCart,
  deleteCart,
};

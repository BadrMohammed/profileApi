const {
  getCart,
  getCartByKey,
  createCart,
  deleteCart,
} = require("../services/CartServices");
const { getProductByKey } = require("../services/ProductServices");
const { getMultipleWishlistByKey } = require("../services/WishlistServices");
const { getImagePath } = require("../utils/imageFunctions");

const responseMessage = require("../utils/responseMessage");

const getAllCart = async (req, res) => {
  try {
    const result = await getCart(req?.id, res.locals.language);
    let ids = result.docs.map((doc) => doc.productId._id);
    const wishlists = await getMultipleWishlistByKey("productId", ids);

    let data = result?.docs.map((cart) => {
      let like = wishlists?.length
        ? wishlists.find(
            (wh) => wh.productId.toString() === cart.productId._id.toString()
          )
          ? true
          : false
        : false;
      let product = {
        ...cart.productId,
        images: cart.productId?.images?.length
          ? cart.productId?.images.map((img) => {
              return {
                url: getImagePath(req, img?.url),
                id: img.id,
              };
            })
          : null,
        like,
      };

      return {
        id: cart.id,
        quantity: cart.quantity,
        // user: cart.userId,
        product: product,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        isAvailable: +product.quantity >= +cart.quantity ? true : false,
        avaliableMessage:
          +product.quantity >= +cart.quantity
            ? ""
            : !product.quantity
            ? req.t("product-not-avaliable")
            : req.t("quantity-not-available"),
      };
    });

    return res.status(200).json(responseMessage("", data, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const addToCart = async (req, res) => {
  const { quantity, productId } = req.body;

  if (!productId)
    return res
      .status(400)
      .json(responseMessage(req.t("product-id-required"), null, 0));

  if (!quantity)
    return res
      .status(400)
      .json(responseMessage(req.t("quantity-required"), null, 0));

  const findProduct = await getProductByKey("_id", productId);
  const findItem = await getCartByKey("productId", productId);

  if (!findProduct)
    return res
      .status(400)
      .json(responseMessage(req.t("product-not-exist"), null, 0));

  if (findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-added-before"), null, 0));
  try {
    let result = await createCart(req?.body, req?.id);

    res
      .status(200)
      .json(responseMessage(req.t("added-to-cart-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const deleteFromCart = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  let findItem = await getCartByKey("_id", id);
  if (!findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-not-exist"), null, 0));

  try {
    const result = await deleteCart(id);
    res
      .status(200)
      .json(responseMessage(req.t("remove-from-cart-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getAllCart, addToCart, deleteFromCart };

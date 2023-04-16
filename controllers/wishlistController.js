const {
  getWishlist,
  getWishlistByKey,
  createWishlist,
  deleteWishlist,
} = require("../services/WishlistServices");
const { getProductByKey } = require("../services/ProductServices");
const { getImagePath } = require("../utils/imageFunctions");
const { getDiscountByParams } = require("../services/DiscountServices");

const responseMessage = require("../utils/responseMessage");
const { getMultipleReviewsByKey } = require("../services/ReviewServices");

const getAllWishlist = async (req, res) => {
  try {
    let allCategoriesDiscount = null;
    let productDiscount = null;
    const result = await getWishlist(req?.query, req?.id, res.locals.language);
    let ids = result.docs.map((doc) => doc.productId._id);

    const discounts = await getDiscountByParams({ isValid: true }, true);
    const reviews = await getMultipleReviewsByKey("productId", ids);

    if (discounts?.length) {
      allCategoriesDiscount = discounts.find((disc) => disc.allCategories);
    }
    let data = result?.docs.map((wishlist) => {
      if (wishlist.productId && discounts?.length) {
        productDiscount = discounts.find((disc) =>
          disc.categoryIds
            ?.map((c) => c.toString())
            ?.includes(wishlist?.productId?.categoryId?._id.toString())
        );
      }

      let filterRating = reviews?.length
        ? reviews.filter(
            (rev) =>
              rev.productId.toString() === wishlist?.productId._id.toString()
          )
        : [];

      let ratingCount = filterRating?.length;
      const ratingSum = filterRating?.length
        ? filterRating.map((r) => r.rating).reduce((b, a) => b + a, 0)
        : 0;
      let totalRating = Math.ceil(ratingSum / +filterRating?.length);

      let product = {
        ...wishlist.productId,
        images: wishlist.productId?.images?.length
          ? wishlist.productId?.images.map((img) => {
              return {
                url: getImagePath(req, img?.url),
                id: img.id,
              };
            })
          : null,
        discount:
          productDiscount?.discount || allCategoriesDiscount?.discount || null,
        ratingCount,
        totalRating,
      };
      if (productDiscount?.discount || allCategoriesDiscount?.discount) {
        product.oldPrice = product.price;
        let disc = productDiscount?.discount || allCategoriesDiscount?.discount;
        disc = parseFloat(disc);
        product.price =
          Math.floor(parseFloat(product.price) * (1 - disc / 100)) + "$";
      }

      return {
        id: wishlist.id,
        // user: cart.userId,
        product: product,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      };
    });
    const pagination = {
      counts: result.counts,
      currentPage: result.currentPage,
      perPage: result.perPage,
      totalPages: result.totalPages,
    };

    return res.status(200).json(responseMessage("", data, 1, pagination));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  if (!productId)
    return res
      .status(400)
      .json(responseMessage(req.t("product-id-required"), null, 0));

  const findProduct = await getProductByKey("_id", productId);
  const findItem = await getWishlistByKey("productId", productId);

  if (!findProduct)
    return res
      .status(400)
      .json(responseMessage(req.t("product-not-exist"), null, 0));

  if (findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-added-before"), null, 0));
  try {
    let result = await createWishlist(req?.body, req?.id);

    res
      .status(200)
      .json(responseMessage(req.t("like-added-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const deleteFromWishlist = async (req, res) => {
  const { productId } = req?.body;

  if (!productId)
    return res
      .status(400)
      .json(responseMessage(req.t("product-id-required"), null, 0));

  const findProduct = await getProductByKey("_id", productId);
  const findItem = await getWishlistByKey("productId", productId);

  if (!findProduct)
    return res
      .status(400)
      .json(responseMessage(req.t("product-not-exist"), null, 0));

  if (!findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-not-exist"), null, 0));

  try {
    const result = await deleteWishlist(findItem._id);
    res
      .status(200)
      .json(responseMessage(req.t("like-removed-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getAllWishlist, addToWishlist, deleteFromWishlist };

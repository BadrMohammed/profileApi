const {
  getDiscounts,
  getDiscountByKey,
  createDiscount,
  updateDiscount,
} = require("../services/DiscountServices");
const { getProductByKey } = require("../services/ProductServices");
const { getCategoryByKey } = require("../services/CategoryServices");

const responseMessage = require("../utils/responseMessage");

const getAllDiscounts = async (req, res) => {
  if (!req?.query.productId)
    return res
      .status(400)
      .json(responseMessage(req.t("product-id-required"), null, 0));
  try {
    const result = await getDiscounts(req?.query, res.locals.language);

    const pagination = {
      counts: result.counts,
      currentPage: result.currentPage,
      perPage: result.perPage,
      totalPages: result.totalPages,
    };
    return res
      .status(200)
      .json(responseMessage("", result?.docs, 1, pagination));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const addReview = async (req, res) => {
  const { isCategories, isProducts, allCategories } = req.body;
  const twoTrue = [isCategories, isProducts, allCategories];

  if (!productId)
    return res
      .status(400)
      .json(responseMessage(req.t("product-id-required"), null, 0));

  if (!comment && !rating)
    return res
      .status(400)
      .json(responseMessage(req.t("comment-or-rating-required"), null, 0));

  const findProduct = await getProductByKey("_id", productId);

  if (!findProduct)
    return res
      .status(400)
      .json(responseMessage(req.t("product-not-exist"), null, 0));

  try {
    if (rating) {
    }
    let result = await createReview(req?.body, req?.id);
    res
      .status(200)
      .json(responseMessage(req.t("review-added-successfully"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const editReview = async (req, res) => {
  const { id, comment, rating } = req?.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  if (!comment && !rating)
    return res
      .status(400)
      .json(responseMessage(req.t("comment-or-rating-required"), null, 0));

  let findItem = await getReviewByKey("_id", id);
  if (!findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-not-exist"), null, 0));

  try {
    const result = await updateReview(findItem, req?.body);
    res
      .status(200)
      .json(responseMessage(req.t("review-updated-successfully"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const removeReview = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  let findItem = await getReviewByKey("_id", id);
  if (!findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-not-exist"), null, 0));

  try {
    const result = await deleteReview(id);
    res
      .status(200)
      .json(responseMessage(req.t("review-deleted-successfully"), null, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = {
  getAllReviews,
  addReview,
  editReview,
  removeReview,
  getTotalReview,
};

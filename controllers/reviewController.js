const {
  getReviews,
  getReviewByKey,
  createReview,
  deleteReview,
  updateReview,
  getTotalReviews,
} = require("../services/ReviewServices");
const { getProductByKey } = require("../services/ProductServices");

const responseMessage = require("../utils/responseMessage");

const getAllReviews = async (req, res) => {
  if (!req?.query.productId)
    return res
      .status(400)
      .json(responseMessage(req.t("product-id-required"), null, 0));
  try {
    const result = await getReviews(req?.query, res.locals.language);
    let data = result?.docs.map((review) => {
      return {
        id: review.id,
        comment: review.comment,
        rating: review.rating,
        user: review.userId,
        product: review.productId,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
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

const getTotalReview = async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("product-id-required"), null, 0));
  try {
    const result = await getTotalReviews(id, req.t);

    const filterdResult = result.docs?.length
      ? result.docs.filter((res) => {
          if (res.rating) {
            return { rating: res.rating, userId: res.userId.toString() };
          }
        })
      : [];

    let combineUsers = filterdResult?.length
      ? filterdResult.map((user) => user.userId.toString())
      : [];
    combineUsers = combineUsers?.length
      ? Array.from(new Set(combineUsers))
      : [];

    let entry = [];

    combineUsers.map((item) => {
      let totalRating = filterdResult.filter(
        (f) => f.userId.toString() === item
      );
      let maxRating = Math.max(...totalRating.map((r) => r.rating));

      entry.push({ rating: maxRating, userId: item });
    });

    const ratingSum = entry?.length
      ? entry.map((r) => r.rating).reduce((b, a) => b + a, 0)
      : 0;

    let finalResult = 0;
    if (ratingSum && combineUsers?.length) {
      finalResult = Math.ceil(ratingSum / +combineUsers?.length);
    }

    return res.status(200).json(responseMessage("", finalResult, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const addReview = async (req, res) => {
  const { comment, rating, productId } = req.body;

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

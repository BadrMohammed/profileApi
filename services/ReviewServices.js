const paginationOptions = require("../enums/paginationOptions");
const Review = require("../models/ReviewModel");

const getReviews = async (params, locale) => {
  const { perPage = 4, page = 1, productId } = params;
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
      },
      {
        path: "productId",
        select: `_id ${locale === "en" ? "nameEn" : "nameAr"}`,
        match: { _id: productId ? productId : undefined },
      },
    ],
  };
  let query = {
    productId: productId && productId,
  };

  const entry = await Review.paginate(query, options);
  return entry;
};

const getTotalReviews = async (productId, locale) => {
  const options = {
    pagination: false,
    lean: true,
    collation: {
      locale: locale,
    },
    sort: { createdAt: -1 },
  };
  let query = {
    productId: productId && productId,
  };
  const entry = await Review.paginate(query, options);
  return entry;
};

function prepareReview(review) {
  return review

    .populate([
      {
        path: "userId",
        select: "_id firstName lastName",
      },
      {
        path: "productId",
        select: "_id nameEn nameAr",
      },
    ])

    .then((res) => {
      let newResult = {
        id: res._id,
        comment: res.comment,
        rating: res.rating,
        user: res.userId,
        product: res.productId,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      };
      return newResult;
    });
}

const createReview = async (formBody, userId) => {
  const entry = await Review.create({
    comment: formBody.comment,
    rating: formBody.rating,
    productId: formBody.productId,
    userId: userId,
  }).then(prepareReview);
  return entry;
};

const updateReview = async (review, formBody) => {
  const entry = review;
  if (formBody.comment) entry.comment = formBody.comment;
  if (formBody.rating) entry.rating = formBody.rating;

  const result = await entry.save().then(prepareReview);
  return result;
};
const deleteReview = async (id) => {
  const result = await Review.deleteOne({ _id: id });
  return result;
};

const getReviewByKey = async (key, value) => {
  const entry = await Review.findOne({ [key]: value }).exec();

  return entry;
};

const getMultipleReviewsByKey = async (key, values, value) => {
  let entry = null;
  if (value) {
    entry = await Review.find({ [key]: value })
      .lean()
      .exec();
  } else {
    entry = await Review.find().where(key).in(values).lean().exec();
  }
  return entry;
};
module.exports = {
  getReviews,
  createReview,
  updateReview,
  getReviewByKey,
  deleteReview,
  getTotalReviews,
  getMultipleReviewsByKey,
};

const {
  getDiscounts,
  getDiscountByKey,
  createDiscount,
  updateDiscount,
  getDiscountByParams,
  getSortedDiscounts,
} = require("../services/DiscountServices");

const responseMessage = require("../utils/responseMessage");
const { getImagePath, removeImage } = require("../utils/imageFunctions");

const getAllDiscounts = async (req, res) => {
  try {
    const result = await getDiscounts(req?.query, res.locals.language);
    result?.docs.map((item) => {
      item.image = item.image ? getImagePath(req, item.image) : null;
      return item;
    });
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

const getMegaDeals = async (req, res) => {
  try {
    const result = await getSortedDiscounts(
      { page: 1, perPage: 10 },
      res.locals.language
    );
    result?.docs.map((item) => {
      item.image = item.image ? getImagePath(req, item.image) : null;
      return item;
    });
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

const getDiscountById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));
  const result = await getDiscountByKey("_id", id, true);
  result.image = getImagePath(req, result?.image);

  res.status(200).json(responseMessage("", result, 1));
};
const addDiscount = async (req, res) => {
  const { categoryIds } = req.body;
  let allCategories = req.body.allCategories === "true" ? true : false;
  let isCategory = req.body.isCategory === "true" ? true : false;

  if (allCategories) {
    let findActiveDiscount = await getDiscountByKey("isValid", true);

    if (findActiveDiscount)
      return res
        .status(400)
        .json(responseMessage(req.t("close-previous-discounts"), null, 0));
  }
  if (categoryIds?.length && !isCategory) {
    return res
      .status(400)
      .json(responseMessage(req.t("category-must-true"), null, 0));
  }

  if (!categoryIds && isCategory) {
    return res
      .status(400)
      .json(responseMessage(req.t("category-ids-required"), null, 0));
  }
  let findDiscounts = await getDiscountByParams({
    isCategory: true,
    isValid: true,
  });
  let tobeClosed = [];

  if (findDiscounts?.length) {
    findDiscounts.map((disc) => {
      disc.categoryIds = disc.categoryIds.filter((c) =>
        categoryIds.find((cc) => cc !== c.toString())
      );
      if (!disc.categoryIds?.length) {
        tobeClosed.push(disc);
      }
    });
  }

  try {
    if (tobeClosed?.length) {
      tobeClosed.map((clos) => {
        updateDiscount(clos, {}, req?.id, null, false);
      });
    }
    const img = req.file ? req.file.filename : null;
    let result = await createDiscount(req?.body, req?.id, img);
    result.image = getImagePath(req, result.image);
    res
      .status(200)
      .json(responseMessage(req.t("discount-created-successfully"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const closeDiscount = async (req, res) => {
  const { id } = req.params;
  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  let findItem = await getDiscountByKey("_id", id);
  if (!findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-not-exist"), null, 0));

  try {
    let result = await updateDiscount(
      findItem,
      req?.body,
      req?.id,
      null,
      false
    );
    res
      .status(200)
      .json(responseMessage(req.t("discount-closed-successfully"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const editDiscount = async (req, res) => {
  const { id } = req?.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  let findItem = await getDiscountByKey("_id", id);

  if (!findItem)
    return res
      .status(400)
      .json(responseMessage(req.t("item-not-exist"), null, 0));

  try {
    const img = req.file ? req.file.filename : null;
    if (img && findItem?.image) {
      removeImage(findItem?.image);
    }
    const result = await updateDiscount(
      findItem,
      req?.body,
      req?.id,
      img,
      undefined
    );
    result.image = getImagePath(req, result?.image);
    res
      .status(200)
      .json(responseMessage(req.t("review-updated-successfully"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = {
  getAllDiscounts,
  addDiscount,
  closeDiscount,
  editDiscount,
  getDiscountById,
  getMegaDeals,
};

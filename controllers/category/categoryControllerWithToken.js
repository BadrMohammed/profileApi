const {
  getCategoryByKey,
  createCategory,
  updateCategory,
} = require("../../services/CategoryServices");
const { getUserByKey } = require("../../services/UserServices");
const { getImagePath, removeImage } = require("../../utils/imageFunctions");
const responseMessage = require("../../utils/responseMessage");

const addCategory = async (req, res) => {
  const { nameEn, nameAr, parent } = req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json(responseMessage(req.t("name-locale-required"), null, 0));
  let findParent = null;
  if (parent) {
    findParent = await getCategoryByKey("_id", parent);

    if (!findParent)
      return res
        .status(409)
        .json(responseMessage(req.t("category-not-exist"), null, 0));
  }
  try {
    const findUser = await getUserByKey("_id", req?.id);
    const img = req.file ? req.file.filename : null;

    let category = await createCategory(req?.body, req?.id, img);
    const result = {
      id: category.id,
      image: getImagePath(req, category?.image),
      nameEn: category.nameEn,
      nameAr: category.nameAr,
      descriptionEn: category.descriptionEn,
      descriptionAr: category.descriptionAr,
      createdAt: category?.createdAt,
      updatedAt: category?.updatedAt,
      isHome: category?.isHome,
      parent: findParent
        ? {
            id: findParent._id,
            image: getImagePath(req, findParent?.image),
            name:
              res.locals.language === "ar"
                ? findParent.nameAr
                : findParent.nameEn,
            description:
              res.locals.language === "ar"
                ? findParent.descriptionAr
                : findParent.descriptionEn,
          }
        : undefined,
      user: {
        id: findUser?.id,
        firstName: findUser?.firstName,
        lastName: findUser?.lastName,
      },
    };

    res.status(200).json(responseMessage(req.t("item-created"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const getCategoryById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  const result = await getCategoryByKey("_id", id);
  result.image = getImagePath(req, result?.image);

  res.status(200).json(responseMessage("", result, 1));
};

const editCategory = async (req, res) => {
  const { id, parent } = req.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  let findParent = null;
  if (parent) {
    findParent = await getCategoryById("_id", parent);

    if (!findParent)
      return res
        .status(409)
        .json(responseMessage(req.t("category-not-exist"), null, 0));
  }
  try {
    const findCategory = await getCategoryByKey("_id", id);
    const img = req.file ? req.file.filename : null;

    if (img && findCategory?.image) {
      removeImage(findCategory?.image);
    }
    const result = await updateCategory(findCategory, req?.body, req?.id, img);

    result.image = getImagePath(req, result?.image);

    res.status(200).json(responseMessage(req.t("item-updated"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getCategoryById, addCategory, editCategory };

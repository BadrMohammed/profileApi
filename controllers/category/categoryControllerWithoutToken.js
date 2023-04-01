const { getCategories } = require("../../services/CategoryServices");
const { getImagePath } = require("../../utils/imageFunctions");
const responseMessage = require("../../utils/responseMessage");

const getAllCategories = async (req, res) => {
  try {
    const result = await getCategories(req?.query, res.locals.language);

    let data = result?.docs.map((category) => {
      return {
        id: category.id,
        image: getImagePath(req, category?.image),
        name: res.locals.language === "ar" ? category.nameAr : category.nameEn,
        description:
          res.locals.language === "ar"
            ? category.descriptionAr
            : category.descriptionEn,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
        user: category.userId,
        parent: category.parent,
      };
    });
    const pagination = {
      counts: result?.counts,
      currentPage: result?.currentPage,
      perPage: result?.perPage,
      totalPages: result?.totalPages,
    };

    return res.status(200).json(responseMessage("", data, 1, pagination));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getAllCategories };

const { getCategoryByKey } = require("../services/CategoryServices");
const { getCountryByKey } = require("../services/CountryServices");
const responseMessage = require("./responseMessage");
const validateProduct = async (req, res) => {
  const { nameEn, nameAr, categoryId, countryId, price, quantity, color } =
    req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json(responseMessage(req.t("name-locale-required"), null, 0));

  if (!categoryId)
    return res
      .status(400)
      .json(responseMessage(req.t("category-id-required"), null, 0));

  if (!countryId)
    return res
      .status(400)
      .json(responseMessage(req.t("country-id-required"), null, 0));

  if (!price)
    return res
      .status(400)
      .json(responseMessage(req.t("price-required"), null, 0));

  if (!quantity)
    return res
      .status(400)
      .json(responseMessage(req.t("quantity-required"), null, 0));

  if (!color)
    return res
      .status(400)
      .json(responseMessage(req.t("color-required"), null, 0));

  findCategory = await getCategoryByKey("_id", categoryId);
  if (!findCategory)
    return res
      .status(400)
      .json(responseMessage(req.t("category-not-exist"), null, 0));

  findCountry = await getCountryByKey("_id", countryId);
  if (!findCountry)
    return res
      .status(400)
      .json(responseMessage(req.t("country-not-exist"), null, 0));

  return { findCategory, findCountry };
};

module.exports = validateProduct;

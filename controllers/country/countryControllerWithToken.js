const {
  getCountryByKey,
  createCountry,
  updateCountry,
} = require("../../services/CountryServices");
const { getUserByKey } = require("../../services/UserServices");
const responseMessage = require("../../utils/responseMessage");

const addCountry = async (req, res) => {
  const { nameEn, nameAr } = req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json(responseMessage(req.t("name-locale-required"), null, 0));

  const dublictedNameEn = await getCountryByKey("nameEn", nameEn);
  const dublictedNameAr = await getCountryByKey("nameAr", nameAr);

  // check for duplicate names
  if (dublictedNameEn)
    return res
      .status(400)
      .json(responseMessage(req.t("name-english-exists"), null, 0));

  if (dublictedNameAr)
    return res
      .status(400)
      .json(responseMessage(req.t("name-arabic-exists"), null, 0));
  try {
    const findUser = await getUserByKey("_id", req?.id);
    let country = await createCountry(req?.body, req?.id);

    const result = {
      nameEn: country.nameEn,
      nameAr: country.nameAr,
      userId: country.userId,
      id: country?._id,
      createdAt: country?.createdAt,
      updatedAt: country?.updatedAt,
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

const getCountryById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  const result = await getCountryByKey("_id", id);
  res.status(200).json(responseMessage("", result, 1));
};

const editCountry = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  try {
    const findCountry = await getCountryByKey("_id", id);
    const result = await updateCountry(findCountry, req?.body, req?.id);

    res.status(200).json(responseMessage(req.t("item-updated"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getCountryById, addCountry, editCountry };

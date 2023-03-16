const {
  getCountryByKey,
  createCountry,
  updateCountry,
} = require("../../services/CountryServices");
const { getUserByKey } = require("../../services/UserServices");

const addCountry = async (req, res) => {
  const { nameEn, nameAr } = req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json({ data: null, error: [req.t("name-locale-required")] });

  const dublictedNameEn = await getCountryByKey("nameEn", nameEn);
  const dublictedNameAr = await getCountryByKey("nameAr", nameAr);

  // check for duplicate names
  if (dublictedNameEn)
    return res
      .status(409)
      .json({ data: null, error: [req.t("name-english-exists")] });

  if (dublictedNameAr)
    return res
      .status(409)
      .json({ data: null, error: [req.t("name-arabic-exists")] });

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

    res.status(200).json({ data: result, message: req.t("item-created") });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: [error.message],
    });
  }
};

const getCountryById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  const result = await getCountryByKey("_id", id);
  res.status(200).json({ data: result, message: "" });
};

const editCountry = async (req, res) => {
  const { id } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  try {
    const findCountry = await getCountryByKey("_id", id);
    const result = await updateCountry(findCountry, req?.body, req?.id);

    res.status(200).json({ data: result, message: req.t("item-updated") });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: [error.message],
    });
  }
};

module.exports = { getCountryById, addCountry, editCountry };

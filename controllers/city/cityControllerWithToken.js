const {
  getCityByKey,
  createCity,
  updateCity,
} = require("../../services/CityServices");
const { getCountryByKey } = require("../../services/CountryServices");
const { getUserByKey } = require("../../services/UserServices");

const addCity = async (req, res) => {
  const { nameEn, nameAr, countryId } = req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json({ data: null, error: [req.t("name-locale-required")] });

  if (!countryId)
    return res
      .status(400)
      .json({ data: null, error: [req.t("country-id-required")] });

  const dublictedNameEn = await getCityByKey("nameEn", nameEn);
  const dublictedNameAr = await getCityByKey("nameAr", nameAr);
  const findCountry = await getCountryByKey("_id", countryId);

  // check for duplicate names
  if (dublictedNameEn)
    return res
      .status(409)
      .json({ data: null, error: [req.t("name-english-exists")] });

  if (dublictedNameAr)
    return res
      .status(409)
      .json({ data: null, error: [req.t("name-arabic-exists")] });

  if (!findCountry)
    return res
      .status(409)
      .json({ data: null, error: [req.t("country-not-exist")] });
  try {
    const findUser = await getUserByKey("_id", req?.id);
    let city = await createCity(req?.body, req?.id);

    const result = {
      nameEn: city.nameEn,
      nameAr: city.nameAr,
      id: city?._id,
      createdAt: city?.createdAt,
      updatedAt: city?.updatedAt,
      country: {
        id: findCountry._id,
        name:
          res.locals.language === "ar"
            ? findCountry.nameAr
            : findCountry.nameEn,
      },
      user: {
        id: findUser?.id,
        firstName: findUser?.firstName,
        lastName: findUser?.lastName,
      },
    };

    res.status(200).json({ data: result, message: req.t("item-created") });
  } catch (error) {
    return res.status(500).json({
      ata: null,
      error: [error.message],
    });
  }
};

const getCityById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  const result = await getCityByKey("_id", id);
  res.status(200).json({ data: result, message: "" });
};

const editCity = async (req, res) => {
  const { id, countryId } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  if (countryId) {
    const findCountry = await getCountryByKey("_id", countryId);

    if (!findCountry)
      return res
        .status(409)
        .json({ data: null, error: [req.t("country-not-exist")] });
  }
  try {
    const findCity = await getCityByKey("_id", id);
    const result = await updateCity(findCity, req?.body, req?.id);

    res.status(200).json({ data: result, message: req.t("item-updated") });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: [error.message],
    });
  }
};

module.exports = { getCityById, addCity, editCity };

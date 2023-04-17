const {
  getCityByKey,
  createCity,
  updateCity,
  getCities,
} = require("../services/CityServices");
const { getCountryByKey } = require("../services/CountryServices");
const { getUserByKey } = require("../services/UserServices");
const responseMessage = require("../utils/responseMessage");

const getAllCities = async (req, res) => {
  try {
    const result = await getCities(req?.query, res.locals.language);

    let data = result?.docs.map((city) => {
      return {
        name: res.locals.language === "ar" ? city.nameAr : city.nameEn,
        createdAt: city.createdAt,
        updatedAt: city.updatedAt,
        id: city.id,
        user: city.userId,
        country: city.countryId,
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

const addCity = async (req, res) => {
  const { nameEn, nameAr, countryId } = req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json(responseMessage(req.t("name-locale-required"), null, 0));

  if (!countryId)
    return res
      .status(400)
      .json(responseMessage(req.t("country-id-required"), null, 0));

  const dublictedNameEn = await getCityByKey("nameEn", nameEn);
  const dublictedNameAr = await getCityByKey("nameAr", nameAr);
  const findCountry = await getCountryByKey("_id", countryId);

  // check for duplicate names
  if (dublictedNameEn)
    return res
      .status(400)
      .json(responseMessage(req.t("name-english-exists"), null, 0));

  if (dublictedNameAr)
    return res
      .status(400)
      .json(responseMessage(req.t("name-arabic-exists"), null, 0));

  if (!findCountry)
    return res
      .status(400)
      .json(responseMessage(req.t("country-not-exist"), null, 0));
  try {
    const findUser = await getUserByKey("_id", req?.id);
    let city = await createCity(req?.body, req?.id);

    const result = {
      nameEn: city.nameEn,
      nameAr: city.nameAr,
      id: city?.id,
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

    res.status(200).json(responseMessage(req.t("item-created"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const getCityById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));
  try {
    const result = await getCityByKey("_id", id);
    if (!result)
      return res
        .status(400)
        .json(responseMessage(req.t("item-not-exist"), null, 0));
    res.status(200).json(responseMessage("", result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

const editCity = async (req, res) => {
  const { id, countryId } = req.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  if (countryId) {
    const findCountry = await getCountryByKey("_id", countryId);

    if (!findCountry)
      return res
        .status(400)
        .json(responseMessage(req.t("country-not-exist"), null, 0));
  }
  try {
    const findCity = await getCityByKey("_id", id);
    const result = await updateCity(findCity, req?.body, req?.id);

    res.status(200).json(responseMessage(req.t("item-updated"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getCityById, addCity, editCity, getAllCities };

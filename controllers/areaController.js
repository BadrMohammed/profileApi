const {
  getAreaByKey,
  createArea,
  updateArea,
  getAreas,
} = require("../services/AreaServices");
const { getCityByKey } = require("../services/CityServices");
const { getUserByKey } = require("../services/UserServices");
const responseMessage = require("../utils/responseMessage");

const getAllAreas = async (req, res) => {
  try {
    const result = await getAreas(req?.query, res.locals.language);

    let data = result?.docs.map((area) => {
      return {
        name: res.locals.language === "ar" ? area.nameAr : area.nameEn,
        createdAt: area.createdAt,
        updatedAt: area.updatedAt,
        id: area.id,
        user: area.userId,
        city: area.cityId,
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

const addArea = async (req, res) => {
  const { nameEn, nameAr, cityId } = req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json(responseMessage(req.t("name-locale-required"), null, 0));

  if (!cityId)
    return res
      .status(400)
      .json(responseMessage(req.t("country-id-required"), null, 0));

  const dublictedNameEn = await getAreaByKey("nameEn", nameEn);
  const dublictedNameAr = await getAreaByKey("nameAr", nameAr);
  const findCity = await getCityByKey("_id", cityId);

  // check for duplicate names
  if (dublictedNameEn)
    return res
      .status(409)
      .json(responseMessage(req.t("name-english-exists"), null, 0));

  if (dublictedNameAr)
    return res
      .status(409)
      .json(responseMessage(req.t("name-arabic-exists"), null, 0));

  if (!findCity)
    return res
      .status(409)
      .json(responseMessage(req.t("city-not-exist"), null, 0));
  try {
    const findUser = await getUserByKey("_id", req?.id);
    let area = await createArea(req?.body, req?.id);

    const result = {
      nameEn: area.nameEn,
      nameAr: area.nameAr,
      id: area?.id,
      createdAt: area?.createdAt,
      updatedAt: area?.updatedAt,
      city: {
        id: findCity._id,
        name: res.locals.language === "ar" ? findCity.nameAr : findCity.nameEn,
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

const getAreaById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  const result = await getAreaByKey("_id", id);
  res.status(200).json(responseMessage("", result, 1));
};

const editArea = async (req, res) => {
  const { id, cityId } = req.body;

  if (!id)
    return res
      .status(400)
      .json(responseMessage(req.t("item-id-required"), null, 0));

  if (cityId) {
    const findCity = await getCityByKey("_id", cityId);

    if (!findCity)
      return res
        .status(409)
        .json(responseMessage(req.t("city-not-exist"), null, 0));
  }
  try {
    const findArea = await getAreaByKey("_id", id);
    const result = await updateArea(findArea, req?.body, req?.id);

    res.status(200).json(responseMessage(req.t("item-updated"), result, 1));
  } catch (error) {
    return res.status(500).json(responseMessage(error.message, null, 0));
  }
};

module.exports = { getAreaById, addArea, editArea, getAllAreas };

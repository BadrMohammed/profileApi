const {
  getAreaByKey,
  createArea,
  updateArea,
} = require("../../services/AreaServices");
const { getCityByKey } = require("../../services/CityServices");
const { getUserByKey } = require("../../services/UserServices");

const addArea = async (req, res) => {
  const { nameEn, nameAr, cityId } = req.body;

  if (!nameEn || !nameAr)
    return res
      .status(400)
      .json({ data: null, error: [req.t("name-locale-required")] });

  if (!cityId)
    return res
      .status(400)
      .json({ data: null, error: [req.t("country-id-required")] });

  const dublictedNameEn = await getAreaByKey("nameEn", nameEn);
  const dublictedNameAr = await getAreaByKey("nameAr", nameAr);
  const findCity = await getCityByKey("_id", cityId);

  // check for duplicate names
  if (dublictedNameEn)
    return res
      .status(409)
      .json({ data: null, error: [req.t("name-english-exists")] });

  if (dublictedNameAr)
    return res
      .status(409)
      .json({ data: null, error: [req.t("name-arabic-exists")] });

  if (!findCity)
    return res
      .status(409)
      .json({ data: null, error: [req.t("city-not-exist")] });
  try {
    const findUser = await getUserByKey("_id", req?.id);
    let area = await createArea(req?.body, req?.id);

    const result = {
      nameEn: area.nameEn,
      nameAr: area.nameAr,
      id: area?._id,
      createdAt: area?.createdAt,
      updatedAt: area?.updatedAt,
      country: {
        id: findCity._id,
        name: res.locals.language === "ar" ? findCity.nameAr : findCity.nameEn,
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

const getAreaById = async (req, res) => {
  const { id } = req?.params;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  const result = await getAreaByKey("_id", id);
  res.status(200).json({ data: result, message: "" });
};

const editArea = async (req, res) => {
  const { id, cityId } = req.body;

  if (!id)
    return res
      .status(400)
      .json({ data: null, error: [req.t("item-id-required")] });

  if (cityId) {
    const findCity = await getCityByKey("_id", cityId);

    if (!findCity)
      return res
        .status(409)
        .json({ data: null, error: [req.t("city-not-exist")] });
  }
  try {
    const findArea = await getAreaByKey("_id", id);
    const result = await updateArea(findArea, req?.body, req?.id);

    res.status(200).json({ data: result, message: req.t("item-updated") });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: [error.message],
    });
  }
};

module.exports = { getAreaById, addArea, editArea };

const { getAreas } = require("../../services/AreaServices");

const getAllAreas = async (req, res) => {
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

  return res.status(200).json({ data, pagination, message: "" });
};

module.exports = { getAllAreas };

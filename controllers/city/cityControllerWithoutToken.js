const { getCities } = require("../../services/CityServices");

const getAllCities = async (req, res) => {
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

  return res.status(200).json({ data, pagination, message: "" });
};

module.exports = { getAllCities };

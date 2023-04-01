const { getCities } = require("../../services/CityServices");
const responseMessage = require("../../utils/responseMessage");

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

module.exports = { getAllCities };

const { getCountries } = require("../../services/CountryServices");
const responseMessage = require("../../utils/responseMessage");

const getAllCountries = async (req, res) => {
  try {
    const result = await getCountries(req?.query, res.locals.language);

    let data = result?.docs.map((country) => {
      return {
        name: res.locals.language === "ar" ? country.nameAr : country.nameEn,
        createdAt: country.createdAt,
        updatedAt: country.updatedAt,
        id: country.id,
        user: country.userId,
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

module.exports = { getAllCountries };

const express = require("express");
const router = express.Router();

const countryControllerWithoutToken = require("../../controllers/country/countryControllerWithoutToken");

router.get("/get", countryControllerWithoutToken.getAllCountries);

module.exports = router;

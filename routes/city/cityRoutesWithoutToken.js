const express = require("express");
const router = express.Router();

const cityControllerWithoutToken = require("../../controllers/city/cityControllerWithoutToken");

router.get("/get", cityControllerWithoutToken.getAllCities);

module.exports = router;

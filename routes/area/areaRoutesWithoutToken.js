const express = require("express");
const router = express.Router();

const areaControllerWithoutToken = require("../../controllers/area/areaControllerWithoutToken");

router.get("/get", areaControllerWithoutToken.getAllAreas);

module.exports = router;

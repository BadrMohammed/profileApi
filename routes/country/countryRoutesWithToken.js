const express = require("express");
const router = express.Router();

const permissions = require("../../config/permissions");
const verifiyPermissions = require("../../middleware/verifiyPermissions");

const countryControllerWithToken = require("../../controllers/country/countryControllerWithToken");

router.post(
  "/create",
  verifiyPermissions(permissions["create-country"]),
  countryControllerWithToken.addCountry
);

router.get(
  "/get/:id",
  verifiyPermissions(permissions["get-country"]),
  countryControllerWithToken.getCountryById
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-country"]),
  countryControllerWithToken.editCountry
);

module.exports = router;

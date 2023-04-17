const express = require("express");
const router = express.Router();

const permissions = require("../config/permissions");
const verifiyPermissions = require("../middleware/verifiyPermissions");

const countryController = require("../controllers/countryController");

router.get("/get", countryController.getAllCountries);

router.get(
  "/get/:id",
  verifiyPermissions(permissions["get-country"]),
  countryController.getCountryById
);

router.post(
  "/create",
  verifiyPermissions(permissions["create-country"]),
  countryController.addCountry
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-country"]),
  countryController.editCountry
);

module.exports = router;

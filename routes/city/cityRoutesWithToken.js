const express = require("express");
const router = express.Router();

const permissions = require("../../config/permissions");
const verifiyPermissions = require("../../middleware/verifiyPermissions");

const cityControllerWithToken = require("../../controllers/city/cityControllerWithToken");

router.post(
  "/create",
  verifiyPermissions(permissions["create-city"]),
  cityControllerWithToken.addCity
);

router.get(
  "/get/:id",
  verifiyPermissions(permissions["get-city"]),
  cityControllerWithToken.getCityById
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-city"]),
  cityControllerWithToken.editCity
);

module.exports = router;

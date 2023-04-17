const express = require("express");
const router = express.Router();

const permissions = require("../config/permissions");
const verifiyPermissions = require("../middleware/verifiyPermissions");

const cityController = require("../controllers/cityController");

router.get("/get", cityController.getAllCities);

router.post(
  "/create",
  verifiyPermissions(permissions["create-city"]),
  cityController.addCity
);

router.get("/get/:id", cityController.getCityById);

router.put(
  "/update",
  verifiyPermissions(permissions["update-city"]),
  cityController.editCity
);

module.exports = router;

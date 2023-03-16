const express = require("express");
const router = express.Router();

const permissions = require("../../config/permissions");
const verifiyPermissions = require("../../middleware/verifiyPermissions");

const areaControllerWithToken = require("../../controllers/area/areaControllerWithToken");

router.post(
  "/create",
  verifiyPermissions(permissions["create-area"]),
  areaControllerWithToken.addArea
);

router.get(
  "/get/:id",
  verifiyPermissions(permissions["get-area"]),
  areaControllerWithToken.getAreaById
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-area"]),
  areaControllerWithToken.editArea
);

module.exports = router;

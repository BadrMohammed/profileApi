const express = require("express");
const router = express.Router();

const permissions = require("../config/permissions");
const verifiyPermissions = require("../middleware/verifiyPermissions");

const areaController = require("../controllers/areaController");

router.post(
  "/create",
  verifiyPermissions(permissions["create-area"]),
  areaController.addArea
);
router.get("/get", areaController.getAllAreas);

router.get("/get/:id", areaController.getAreaById);

router.put(
  "/update",
  verifiyPermissions(permissions["update-area"]),
  areaController.editArea
);

module.exports = router;

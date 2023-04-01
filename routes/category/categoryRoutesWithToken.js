const express = require("express");
const router = express.Router();

const permissions = require("../../config/permissions");
const verifiyPermissions = require("../../middleware/verifiyPermissions");
const categoryControllerWithToken = require("../../controllers/category/categoryControllerWithToken");
const upload = require("../../middleware/storage");

router.post(
  "/create",
  verifiyPermissions(permissions["create-category"]),
  upload.single("image"),
  categoryControllerWithToken.addCategory
);

router.get(
  "/get/:id",
  verifiyPermissions(permissions["get-category"]),
  categoryControllerWithToken.getCategoryById
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-category"]),
  upload.single("image"),
  categoryControllerWithToken.editCategory
);

module.exports = router;

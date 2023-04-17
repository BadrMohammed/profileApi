const express = require("express");
const router = express.Router();

const permissions = require("../config/permissions");
const verifiyPermissions = require("../middleware/verifiyPermissions");
const categoryController = require("../controllers/categoryController");
const upload = require("../middleware/storage");

router.get("/get", categoryController.getAllCategories);

router.get("/get/:id", categoryController.getCategoryById);

router.post(
  "/create",
  verifiyPermissions(permissions["create-category"]),
  upload.single("image"),
  categoryController.addCategory
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-category"]),
  upload.single("image"),
  categoryController.editCategory
);

module.exports = router;

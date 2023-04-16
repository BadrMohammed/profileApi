const express = require("express");
const router = express.Router();

const permissions = require("../config/permissions");
const verifiyPermissions = require("../middleware/verifiyPermissions");
const productController = require("../controllers/productController");
const upload = require("../middleware/storage");

router.get("/get", productController.getAllProducts);

router.post(
  "/create",
  verifiyPermissions(permissions["create-product"]),
  upload.array("images"),
  productController.addProduct
);

router.get("/get/:id", productController.getProductById);

router.put(
  "/update",
  verifiyPermissions(permissions["update-product"]),
  upload.array("images"),
  productController.editProduct
);

router.delete(
  "/deleteImage",
  verifiyPermissions(permissions["delete-product-image"]),
  productController.deleteImage
);

module.exports = router;

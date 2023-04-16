const express = require("express");
const router = express.Router();

const permissions = require("../config/permissions");
const verifiyPermissions = require("../middleware/verifiyPermissions");
const DiscountController = require("../controllers/DiscountController");
const upload = require("../middleware/storage");

router.get(
  "/get",
  verifiyPermissions(permissions["get-discounts"]),
  DiscountController.getAllDiscounts
);
router.get("/megaDeals", DiscountController.getMegaDeals);

router.post(
  "/create",
  verifiyPermissions(permissions["create-discount"]),
  upload.single("image"),
  DiscountController.addDiscount
);

router.put(
  "/close/:id",
  verifiyPermissions(permissions["close-discount"]),
  DiscountController.closeDiscount
);

router.get(
  "/get/:id",
  verifiyPermissions(permissions["get-discount"]),
  DiscountController.getDiscountById
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-discount"]),
  upload.single("image"),
  DiscountController.editDiscount
);

module.exports = router;

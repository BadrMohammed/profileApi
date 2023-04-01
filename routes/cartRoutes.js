const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cartController");

router.get("/get", cartController.getAllCart);

router.post("/addToCart", cartController.addToCart);
router.delete("/deleteFromCart/:id", cartController.deleteFromCart);

module.exports = router;

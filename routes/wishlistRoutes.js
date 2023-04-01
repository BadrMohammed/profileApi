const express = require("express");
const router = express.Router();

const wishlistController = require("../controllers/wishlistController");

router.get("/get", wishlistController.getAllWishlist);

router.post("/addToWishlist", wishlistController.addToWishlist);
router.delete("/deleteFromWishlist", wishlistController.deleteFromWishlist);

module.exports = router;

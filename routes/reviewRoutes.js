const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");

router.get("/get", reviewController.getAllReviews);
router.get("/getTotal/:id", reviewController.getTotalReview);

router.post("/create", reviewController.addReview);
router.put("/update", reviewController.editReview);
router.delete("/delete/:id", reviewController.removeReview);

module.exports = router;

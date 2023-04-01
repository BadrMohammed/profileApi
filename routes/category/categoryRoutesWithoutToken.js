const express = require("express");
const router = express.Router();

const categoryControllerWithoutToken = require("../../controllers/category/categoryControllerWithoutToken");

router.get("/get", categoryControllerWithoutToken.getAllCategories);

module.exports = router;

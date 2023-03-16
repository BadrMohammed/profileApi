const express = require("express");
const router = express.Router();

const authenticationControllerWithToken = require("../../controllers/auth/authenticationControllerWithToken");

router.get("/logout", authenticationControllerWithToken.logout);

module.exports = router;

const express = require("express");
const router = express.Router();

const authenticationControllerWithoutToken = require("../../controllers/auth/authenticationControllerWithoutToken");

router.post("/register", authenticationControllerWithoutToken.register);
router.post("/verifiyUser", authenticationControllerWithoutToken.verifiyUser);
router.post("/login", authenticationControllerWithoutToken.login);
router.post(
  "/resetPassword",
  authenticationControllerWithoutToken.resetPassword
);

module.exports = router;

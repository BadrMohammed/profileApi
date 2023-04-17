const express = require("express");
const router = express.Router();

const authenticationController = require("../controllers/authenticationController");

router.post("/register", authenticationController.register);
router.post("/verifiyUser", authenticationController.verifiyUser);
router.post("/login", authenticationController.login);
router.post("/resetPassword", authenticationController.resetPassword);
router.get("/logout", authenticationController.logout);

module.exports = router;

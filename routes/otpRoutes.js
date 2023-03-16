const express = require("express");
const router = express.Router();

const otpController = require("../controllers/otpController");

router.post("/sendVerification", otpController.sendVerificationCode);

router.post("/verifiyCode", otpController.verifiyCode);

module.exports = router;

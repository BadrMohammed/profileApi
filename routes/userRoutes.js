const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.get("/get", userController.getAllUsers);

router.get("/get/:id", userController.getUserById);

router.post("/create", userController.addUser);

router.put("/update", userController.editUser);

module.exports = router;

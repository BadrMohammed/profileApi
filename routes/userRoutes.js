const express = require("express");
const router = express.Router();

const permissions = require("../config/permissions");
const verifiyPermissions = require("../middleware/verifiyPermissions");

const userController = require("../controllers/userController");

router.get(
  "/get",
  verifiyPermissions(permissions["get-users"]),
  userController.getAllUsers
);

router.get(
  "/profile",
  verifiyPermissions(permissions["get-user"]),
  userController.getUserById
);

router.post(
  "/create",
  verifiyPermissions(permissions["create-user"]),
  userController.addUser
);

router.put(
  "/update",
  verifiyPermissions(permissions["update-user"]),
  userController.editUser
);

module.exports = router;

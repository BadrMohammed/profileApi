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

router.get("/profile", userController.getUserById);

router.post(
  "/create",
  verifiyPermissions(permissions["create-user"]),
  userController.addUser
);

// router.put(
//   "/update",
//   verifiyPermissions(permissions["update-user"]),
//   userController.editUser
// );

router.put("/profile/update", userController.editUser);

module.exports = router;

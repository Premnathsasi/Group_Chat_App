const express = require("express");
const userController = require("../controller/user");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/", userController.getAllUsers);
router.get("/:groupId", userController.getUserByGroup);

module.exports = router;

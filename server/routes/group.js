const express = require("express");
const groupController = require("../controller/group");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/create", authenticate, groupController.createGroup);
router.get("/", authenticate, groupController.getGroups);
router.post("/add-members", authenticate, groupController.addMembers);

module.exports = router;

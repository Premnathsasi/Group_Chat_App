const express = require("express");
const messageController = require("../controller/messages");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticate, messageController.postMessage);
router.get("/", messageController.getMessage);

module.exports = router;

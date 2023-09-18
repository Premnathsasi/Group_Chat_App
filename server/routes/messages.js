const express = require("express");
const messageController = require("../controller/messages");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.post("/postMessage", authenticate, messageController.postMessage);

module.exports = router;

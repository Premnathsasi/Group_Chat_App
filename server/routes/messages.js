const express = require("express");
const messageController = require("../controller/messages");
const { authenticate } = require("../middleware/auth");
const multer = require("multer");

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/",
  authenticate,
  upload.single("file"),
  messageController.postMessage
);
router.get("/", messageController.getMessages);

module.exports = router;

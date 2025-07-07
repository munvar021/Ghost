const express = require("express");
const multer = require("multer");
const { uploadResume } = require("../controllers/resumeController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("resume"), uploadResume);

module.exports = router;

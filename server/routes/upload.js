const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { processFilesFCFS } = require("../schedulingAlgo/fcfs");
const { processFilesLJF } = require("../schedulingAlgo/ljfs");
const { processFilesSJF } = require("../schedulingAlgo/sjfs");
const { processFilesRR } = require("../schedulingAlgo/rr.js");
const {
  processFilesPriorityNonPreemptive,
} = require("../schedulingAlgo/priority");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

async function removeJunkFiles(files) {
  files?.forEach((file) => {
    if (file?.path) {
      fs.unlink(file.path, (err) => {
        if (err) {
          console.log("Error deleting file:", err);
        }
      });
    }
  });
  console.log("Removed junk files");
}

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const { files } = req;
    const { algo } = req.body;

    if (!files || files.length === 0) {
      return res.json({ success: false, message: "No files received" });
    }
    const fileQueue = files.map((file) => ({
      file,
      arrivalTime: Date.now(),
    }));

    let result = [];

    switch (algo) {
      case "fcfs":
        result = await processFilesFCFS(fileQueue);
        break;
      case "ljfs":
        result = await processFilesLJF(fileQueue);
        break;
      case "sjfs":
        result = await processFilesSJF(fileQueue);
        break;
      case "rr":
        result = await processFilesRR(fileQueue);
        break;
      case "priority":
        result = await processFilesPriorityNonPreemptive(fileQueue);
        break;
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid algorithm selected" });
    }

    await removeJunkFiles(files);

    return res.json({
      success: true,
      message: "Files uploaded successfully",
      result,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res
      .status(500)
      .json({ success: false, message: "File upload failed" });
  }
});

module.exports = router;

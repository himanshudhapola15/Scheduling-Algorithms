const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { processFilesFCFS } = require("../schedulingAlgo/fcfs");
const { processFilesLJF } = require("../schedulingAlgo/ljfs");
const { processFilesSJF } = require("../schedulingAlgo/sjfs");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

function deleteUploadedFiles(files) {
  files.forEach((file) => {
    const filePath = path.join(uploadDir, file.originalname);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`Deleted: ${filePath}`);
      }
    } catch (err) {
      console.error(`Error deleting ${filePath}:`, err.message);
    }
  });
}


const upload = multer({ storage });

router.post("/", upload.array("files"), async (req, res) => {
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

  try {
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
      default:
        return res
          .status(400)
          .json({ success: false, message: "Invalid algorithm selected" });
    }
    deleteUploadedFiles(files);

    return res.json({
      success: true,
      message: "Files processed and encrypted successfully",
      result,
    });
  } catch (err) {
    console.error("Upload error:", err);r
    deleteUploadedFiles(files);
    return res
      .status(500)
      .json({ success: false, message: "File upload failed" });
  }
});


module.exports = router;

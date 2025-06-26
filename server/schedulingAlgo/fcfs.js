const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync("encryption key", "salt", 32);
const iv = crypto.randomBytes(16);

function simulateProcessing(fileName) {
  const time = Math.floor(Math.random() * 3000) + 1000;
  return new Promise((resolve) => setTimeout(resolve, time));
}

function encryptFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    input.pipe(cipher).pipe(output);
    output.on("finish", resolve);
    input.on("error", reject);
    output.on("error", reject);
  });
}

function deleteFileSafe(fileName) {
  const filePath = path.join(__dirname, "..", "uploads", fileName);
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error(`Failed to delete ${filePath}:`, err.message);
    }
  });
}


async function processFilesFCFS(fileQueue) {
  const results = [];

  for (const { file, arrivalTime } of fileQueue) {
    const originalName = file.originalname;
    const inputPath = file.path;
    const encryptedPath = path.join(
      path.dirname(inputPath),
      `${path.parse(originalName).name}_encrypted${path.extname(originalName)}`
    );

    const start = Date.now();
    await simulateProcessing(originalName);
    await encryptFile(inputPath, encryptedPath);
    const end = Date.now();

    deleteFileSafe(originalName);
    
    results.push({
      file: originalName,
      encryptedPath,
      arrivalTime,
      startTime: start,
      endTime: end,
      burstTime: end - start,
    });
  }

  return results;
}

module.exports = {
  processFilesFCFS,
};

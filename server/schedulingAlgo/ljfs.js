const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync("encryption key", "salt", 32);
const iv = crypto.randomBytes(16);

const uploadDir = path.join(__dirname, "..", "uploads");

function estimateProcessingTime() {
  return Math.floor(Math.random() * 3000) + 1000;
}

function simulateProcessing(fileName, time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function encryptFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);

    input.pipe(cipher).pipe(output);
    output.on("finish", () => {
      resolve();
    });

    input.on("error", reject);
    output.on("error", reject);
  });
}

function deleteFileSafe(fileName) {
  const filePath = path.join(uploadDir, fileName);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error(`Failed to delete ${filePath}:`, err.message);
  }
}

async function processFilesLJF(fileQueue) {
  const results = [];

  const fileQueueWithBurst = fileQueue.map(({ file, arrivalTime }) => {
    const estimatedBurst = estimateProcessingTime();
    return { file, arrivalTime, estimatedBurst };
  });

  fileQueueWithBurst.sort((a, b) => b.estimatedBurst - a.estimatedBurst);

  for (const { file, arrivalTime, estimatedBurst } of fileQueueWithBurst) {
    const originalName = file.originalname;
    const inputPath = path.join(uploadDir, originalName);
    const encryptedPath = path.join(
      uploadDir,
      `${path.parse(originalName).name}_encrypted${path.extname(originalName)}`
    );
    const start = Date.now();
    await simulateProcessing(originalName, estimatedBurst);
    await encryptFile(inputPath, encryptedPath);
    const end = Date.now();
    const burstTime = end - start;

    deleteFileSafe(originalName);

    results.push({
      file: originalName,
      encryptedPath,
      arrivalTime,
      startTime: start,
      endTime: end,
      burstTime,
    });
  }

  return results;
}

module.exports = {
  processFilesLJF,
};

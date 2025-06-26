import Encryptor from "file-encryptor";
import path from "path";

const key = "encryption key";
const options = { algorithm: "sha256" };
const timeQuantum = 2000;

function estimateProcessingTime() {
  return Math.floor(Math.random() * 3000) + 2000;
}

function simulateProcessing(fileName, time) {
  console.log(`Processing: ${fileName} for ${time}ms`);
  return new Promise((resolve) => setTimeout(resolve, time));
}

function encryptFile(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    Encryptor.encrypt(inputPath, outputPath, key, options, (err) => {
      if (err) return reject(err);
      console.log(`Encrypted: ${outputPath}`);
      resolve();
    });
  });
}

export async function processFilesRR(fileQueue) {
  const results = [];

  console.log(fileQueue);
  const rrQueue = fileQueue.map(({ file, arrivalTime }) => {
    const burstTime = estimateProcessingTime();
    return {
      file,
      arrivalTime,
      burstTime,
      remainingTime: burstTime,
      startTime: null,
      totalProcessed: 0,
    };
  });

  let currentTime = Date.now();

  while (rrQueue.length > 0) {
    const task = rrQueue.shift();

    try {
      const originalName =
        task.file.originalName || task.file.originalname || task.file.filename;
      const inputPath = task.file.path;
      const encryptedPath = path.join(
        path.dirname(inputPath),
        `${path.parse(originalName).name}_encrypted${path.extname(
          originalName
        )}`
      );

      console.log("Encrypting:", inputPath, "→", encryptedPath);

      if (task.startTime === null) {
        task.startTime = currentTime;
      }

      const slice = Math.min(task.remainingTime, timeQuantum);
      console.log(
        `Starting ${originalName} at ${new Date(
          currentTime
        ).toISOString()} with ${slice}ms`
      );

      await simulateProcessing(originalName, slice);
      task.totalProcessed += slice;
      task.remainingTime -= slice;
      currentTime = Date.now();

      if (task.remainingTime <= 0) {
        await encryptFile(inputPath, encryptedPath);
        const endTime = Date.now();
        console.log(
          `Finished: ${originalName} at ${new Date(endTime).toISOString()}`
        );
        console.log(`Total Burst Time: ${task.totalProcessed}ms`);
        results.push({
          file: originalName,
          encryptedPath,
          arrivalTime: task.arrivalTime,
          startTime: task.startTime,
          endTime,
          burstTime: task.totalProcessed,
        });
      } else {
        rrQueue.push(task);
      }
    } catch (err) {
      console.error("Error processing file:", err);
    }
  }
  
  console.log("Final RR Results:", results);
  return results;
}

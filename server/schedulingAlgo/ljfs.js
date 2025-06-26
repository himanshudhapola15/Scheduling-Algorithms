import Encryptor from "file-encryptor";
import path from "path";
const key = "encryption key";
const options = { algorithm: "sha256" };

function estimateProcessingTime() {
  return Math.floor(Math.random() * 3000) + 1000; 
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

export async function processFilesLJF(fileQueue) {
  const results = [];
  const fileQueueWithBurst = fileQueue.map(({ file, arrivalTime }) => {
    const estimatedBurst = estimateProcessingTime();
    return { file, arrivalTime, estimatedBurst };
  });

  fileQueueWithBurst.sort((a, b) => b.estimatedBurst - a.estimatedBurst);
  for (const { file, arrivalTime, estimatedBurst } of fileQueueWithBurst) {
    const originalName = file.originalname;
    const inputPath = file.path;
    const encryptedPath = path.join(
      path.dirname(inputPath),
      `${path.parse(originalName).name}_encrypted${path.extname(originalName)}`
    );

    console.log(
      `Starting: ${originalName} at ${new Date(arrivalTime).toISOString()}`
    );

    const start = Date.now();
    await simulateProcessing(originalName, estimatedBurst);
    await encryptFile(inputPath, encryptedPath);
    const end = Date.now();
    const burstTime = end - start;

    console.log(`Finished: ${originalName} at ${new Date(end).toISOString()}`);
    console.log(`Burst Time: ${burstTime}ms`);

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

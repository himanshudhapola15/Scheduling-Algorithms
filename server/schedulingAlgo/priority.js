import Encryptor from "file-encryptor";
import path from "path";
import fs from "fs";

const key = "encryption key";
const options = { algorithm: "sha256" };

function estimateProcessingTime() {
  return Math.floor(Math.random() * 3000) + 1000; // 1000–4000ms
}

function assignPriority() {
  return Math.floor(Math.random() * 5) + 1; // Priority 1 (highest) to 5 (lowest)
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

export async function processFilesPriorityNonPreemptive(fileQueue) {
  const results = [];

  // Step 1: Assign burst time and priority to each file
  const priorityQueue = fileQueue.map(({ file, arrivalTime }) => {
    return {
      file,
      arrivalTime,
      burstTime: estimateProcessingTime(),
      priority: assignPriority(),
    };
  });

  // Step 2: Sort by priority (ascending: lower number = higher priority)
  priorityQueue.sort((a, b) => a.priority - b.priority);

  // Step 3: Process each file fully (non-preemptive)
  for (const { file, arrivalTime, burstTime, priority } of priorityQueue) {
    const originalName = file.originalname;
    const inputPath = file.path;
    const encryptedPath = path.join(
      path.dirname(inputPath),
      `${path.parse(originalName).name}_encrypted${path.extname(originalName)}`
    );

    console.log(
      `Starting: ${originalName} (Priority ${priority}) at ${new Date(
        arrivalTime
      ).toISOString()}`
    );

    const start = Date.now();
    await simulateProcessing(originalName, burstTime);
    await encryptFile(inputPath, encryptedPath);
    const end = Date.now();

    console.log(`Finished: ${originalName} at ${new Date(end).toISOString()}`);
    console.log(`Burst Time: ${burstTime}ms`);

    results.push({
      file: originalName,
      encryptedPath,
      priority,
      arrivalTime,
      startTime: start,
      endTime: end,
      burstTime,
    });

    fs.unlinkSync(inputPath); // Remove original file
  }

  return results;
}

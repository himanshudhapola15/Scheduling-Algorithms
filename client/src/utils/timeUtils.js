export const normalizeTime = (time, minTime, maxTime) => {
  if (maxTime === minTime) return 0;
  return (time - minTime) / (maxTime - minTime);
};

export const formatTime = (timestamp) => {
  const seconds = Math.floor((timestamp % 60000) / 1000);
  const milliseconds = timestamp % 1000;

  return `${seconds}.${milliseconds.toString().padStart(3, "0")}s`;
};

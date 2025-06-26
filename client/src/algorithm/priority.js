export function runPriority(processes) {
  const n = processes.length;
  const remaining = processes.map((p) => ({
    ...p,
    remainingTime: p.burstTime,
    hasStarted: false,
    start: null,
  }));
  const gantt = [];
  const result = [];
  let currentTime = 0;
  let lastProcessId = null;

  while (remaining.some((p) => p.remainingTime > 0)) {
    const available = remaining.filter(
      (p) => p.arrivalTime <= currentTime && p.remainingTime > 0
    );

    if (available.length === 0) {
      if (lastProcessId !== "Idle") {
        gantt.push({ id: "Idle", start: currentTime, duration: 1 });
        lastProcessId = "Idle";
      } else {
        gantt[gantt.length - 1].duration += 1;
      }
      currentTime++;
      continue;
    }

    available.sort((a, b) => a.priority - b.priority);
    const currentProcess = available[0];

    // Record first start time
    if (!currentProcess.hasStarted) {
      currentProcess.start = currentTime;
      currentProcess.hasStarted = true;
    }

    // Update Gantt chart
    if (lastProcessId !== currentProcess.id) {
      gantt.push({ id: currentProcess.id, start: currentTime, duration: 1 });
      lastProcessId = currentProcess.id;
    } else {
      gantt[gantt.length - 1].duration += 1;
    }

    currentProcess.remainingTime -= 1;
    currentTime++;

    // If process finishes
    if (currentProcess.remainingTime === 0) {
      const completion = currentTime;
      const turnaround = completion - currentProcess.arrivalTime;
      const waiting = turnaround - currentProcess.burstTime;

      result.push({
        id: currentProcess.id,
        arrivalTime: currentProcess.arrivalTime,
        burstTime: currentProcess.burstTime,
        priority: currentProcess.priority,
        start: currentProcess.start,
        completion,
        turnaround,
        waiting,
      });
    }
  }

  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const totalTime = currentTime;
  const avgWaitingTime = (
    result.reduce((sum, p) => sum + p.waiting, 0) / n
  ).toFixed(2);
  const avgTurnaroundTime = (
    result.reduce((sum, p) => sum + p.turnaround, 0) / n
  ).toFixed(2);
  const cpuUtilization = ((totalBurstTime / totalTime) * 100).toFixed(2);

  return {
    result,
    gantt,
    totalTime,
    avgWaitingTime,
    avgTurnaroundTime,
    cpuUtilization,
  };
}

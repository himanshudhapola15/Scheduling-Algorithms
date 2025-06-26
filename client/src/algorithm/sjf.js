export function runSJF(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  const completed = [];
  let time = 0;
  const gantt = [];

  while (completed.length < processes.length) {
    const available = sorted.filter(
      (p) => p.arrivalTime <= time && !completed.includes(p)
    );

    if (available.length === 0) {
      gantt.push({ id: "Idle", start: time, duration: 1 });
      time++;
      continue;
    }

    const next = available.reduce((min, curr) =>
      curr.burstTime < min.burstTime ? curr : min
    );

    const start = time;
    const completion = start + next.burstTime;
    const turnaround = completion - next.arrivalTime;
    const waiting = start - next.arrivalTime;

    completed.push({
      ...next,
      start,
      completion,
      turnaround,
      waiting,
    });

    gantt.push({
      id: next.id,
      start,
      duration: next.burstTime,
    });

    time = completion;
  }

  // Metrics
  const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
  const endTime =
    gantt[gantt.length - 1].start + gantt[gantt.length - 1].duration;
  const totalWaiting = completed.reduce((sum, p) => sum + p.waiting, 0);
  const totalTurnaround = completed.reduce((sum, p) => sum + p.turnaround, 0);

  return {
    result: completed,
    gantt,
    totalTime: endTime,
    avgWaitingTime: (totalWaiting / completed.length).toFixed(2),
    avgTurnaroundTime: (totalTurnaround / completed.length).toFixed(2),
    cpuUtilization: ((totalBurstTime / endTime) * 100).toFixed(2),
  };
}

export function runFCFS(processes) {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
  let time = 0;
  const output = [];
  const gantt = [];
  sorted.forEach((p) => {
    if (p.arrivalTime > time) {
      gantt.push({ id: "Idle", start: time, duration: p.arrivalTime - time });
      time = p.arrivalTime;
    }
    const start = time;
    const completion = start + p.burstTime;
    const turnaround = completion - p.arrivalTime;
    const waiting = start - p.arrivalTime;
    output.push({ ...p, start, completion, turnaround, waiting });
    gantt.push({ id: p.id, start, duration: p.burstTime });
    time = completion;
  });
  const totalBurstTime = sorted.reduce((sum, p) => sum + p.burstTime, 0);
  const endTime = gantt.at(-1).start + gantt.at(-1).duration;
  const totalWaiting = output.reduce((sum, p) => sum + p.waiting, 0);
  const totalTurnaround = output.reduce((sum, p) => sum + p.turnaround, 0);
  const avgWaiting = totalWaiting / output.length;
  const avgTurnaround = totalTurnaround / output.length;
  const utilization = (totalBurstTime / endTime) * 100;
  return {
    result: output,
    gantt,
    totalTime: endTime,
    avgWaitingTime: avgWaiting.toFixed(2),
    avgTurnaroundTime: avgTurnaround.toFixed(2),
    cpuUtilization: utilization.toFixed(2),
  };
}

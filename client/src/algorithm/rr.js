  export function runRR(processes, timeQuantum) {
    const queue = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const gantt = [];
    const result = [];
    const remaining = queue.map((p) => ({ ...p, remainingTime: p.burstTime }));

    let currentTime = 0;
    const completed = new Set();
    const firstResponse = {}; // store first execution time for each process

    const readyQueue = [];

    while (completed.size < processes.length) {
      // Add newly arrived processes to the ready queue
      for (const p of remaining) {
        if (
          p.arrivalTime <= currentTime &&
          !completed.has(p.id) &&
          !readyQueue.includes(p)
        ) {
          readyQueue.push(p);
        }
      }

      if (readyQueue.length === 0) {
        // CPU is idle
        const nextArrival = Math.min(
          ...remaining
            .filter((p) => !completed.has(p.id))
            .map((p) => p.arrivalTime)
        );
        gantt.push({
          id: "Idle",
          start: currentTime,
          duration: nextArrival - currentTime,
        });
        currentTime = nextArrival;
        continue;
      }

      const process = readyQueue.shift();

      const execTime = Math.min(timeQuantum, process.remainingTime);
      const start = currentTime;
      const end = start + execTime;

      if (!firstResponse[process.id]) {
        firstResponse[process.id] = start;
      }

      gantt.push({ id: process.id, start, duration: execTime });

      currentTime = end;
      process.remainingTime -= execTime;

      if (process.remainingTime === 0) {
        const completion = currentTime;
        const turnaround = completion - process.arrivalTime;
        const waiting = turnaround - process.burstTime;

        result.push({
          id: process.id,
          arrivalTime: process.arrivalTime,
          burstTime: process.burstTime,
          start: firstResponse[process.id],
          completion,
          turnaround,
          waiting,
        });

        completed.add(process.id);
      } else {
        // Add back to ready queue after CPU cycle
        for (const p of remaining) {
          if (
            p.arrivalTime <= currentTime &&
            !completed.has(p.id) &&
            !readyQueue.includes(p) &&
            p.id !== process.id
          ) {
            readyQueue.push(p);
          }
        }
        readyQueue.push(process); // push current process to end
      }
    }

    const totalBurstTime = processes.reduce((sum, p) => sum + p.burstTime, 0);
    const totalTime = gantt.at(-1).start + gantt.at(-1).duration;
    const totalWaiting = result.reduce((sum, p) => sum + p.waiting, 0);
    const totalTurnaround = result.reduce((sum, p) => sum + p.turnaround, 0);
    const avgWaitingTime = (totalWaiting / result.length).toFixed(2);
    const avgTurnaroundTime = (totalTurnaround / result.length).toFixed(2);
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

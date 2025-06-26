import React from "react";
import GanttChart from "./GanttChart";

const ProcessScheduler = ({ processes }) => {
  return (
    <div className="w-full p-4">
      <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">
        CPU Process Scheduler
      </h1>
      <GanttChart processes={processes} />

      <div className="p-4 mt-8 bg-white rounded-lg shadow-md">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Scheduling Statistics
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700">
              Average Waiting Time
            </h3>
            <p className="text-2xl font-bold text-blue-900">
              {formatAverageWaitingTime(processes)}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-700">
              Average Turnaround Time
            </h3>
            <p className="text-2xl font-bold text-purple-900">
              {formatAverageTurnaroundTime(processes)}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700">
              CPU Utilization
            </h3>
            <p className="text-2xl font-bold text-green-900">
              {calculateCpuUtilization(processes)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions for stats calculation
const formatAverageWaitingTime = (processes) => {
  const totalWaitingTime = processes.reduce(
    (total, p) => total + (p.startTime - p.arrivalTime),
    0,
  );
  const average = totalWaitingTime / processes.length;
  return `${(average / 1000).toFixed(2)}s`;
};

const formatAverageTurnaroundTime = (processes) => {
  const totalTurnaroundTime = processes.reduce(
    (total, p) => total + (p.endTime - p.arrivalTime),
    0,
  );
  const average = totalTurnaroundTime / processes.length;
  return `${(average / 1000).toFixed(2)}s`;
};

const calculateCpuUtilization = (processes) => {
  if (processes.length === 0) return "0%";

  const minTime = Math.min(...processes.map((p) => p.arrivalTime));
  const maxTime = Math.max(...processes.map((p) => p.endTime));
  const totalTime = maxTime - minTime;

  const busyTime = processes.reduce((total, p) => total + p.burstTime, 0);
  const utilization = (busyTime / totalTime) * 100;

  return `${utilization.toFixed(1)}%`;
};

export default ProcessScheduler;

export default function ResultTable({
  result,
  totalTime,
  avgWaitingTime,
  avgTurnaroundTime,
  cpuUtilization,
}) {
  return (
    <div>
      <h2 className="font-medium mb-2 text-white text-lg">
        Simulation Result:
      </h2>
      <table className="w-full border-2 mt-2">
        <thead>
          <tr className="bg-gray-200 text-teal-500">
            <th className="p-2 border-2 border-teal-500 ">Process ID</th>
            <th className="p-2 border-2 border-teal-500 ">Arrival Time</th>
            <th className="p-2 border-2 border-teal-500 ">Burst TIme</th>
            <th className="p-2 border-2 border-teal-500">Start Time</th>
            <th className="p-2 border-2 border-teal-500 ">Completion Time</th>
            <th className="p-2 border-2 border-teal-500 ">Turn Around Time</th>
            <th className="p-2 border-2 border-teal-500 ">Waiting Time</th>
          </tr>
        </thead>
        <tbody>
          {result.map((p) => (
            <tr key={p.id} className="border-t font-medium">
              <td className="p-2 border">P{p.id}</td>
              <td className="p-2 border">{p.arrivalTime}</td>
              <td className="p-2 border">{p.burstTime}</td>
              <td className="p-2 border">{p.start}</td>
              <td className="p-2 border">{p.completion}</td>
              <td className="p-2 border">{p.turnaround}</td>
              <td className="p-2 border">{p.waiting}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 space-y-1 text-base ">
        <p>
          <strong className="text-gray-400">Total Time:</strong> {totalTime}
        </p>
        <p>
          <strong className="text-gray-400">CPU Utilization:</strong>{" "}
          {cpuUtilization}%
        </p>
        <p>
          <strong className="text-gray-400">Average Waiting Time:</strong>{" "}
          {avgWaitingTime}
        </p>
        <p>
          <strong className="text-gray-400">Average Turnaround Time:</strong>{" "}
          {avgTurnaroundTime}
        </p>
      </div>
    </div>
  );
}

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ComparisonChart({ data }) {
  return (
    <>
      <h2 className="text-xl mt-10 font-bold text-center">
        Algorithm Comparison
      </h2>
      <div className="bg-gray-800 p-4 rounded-xl mt-2 text-white">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid stroke="#444" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="avgWaitingTime"
              fill="#ffc658"
              name="Avg Waiting Time"
            />
            <Bar
              dataKey="avgTurnaroundTime"
              fill="#82ca9d"
              name="Avg Turnaround"
            />
            <Bar
              dataKey="cpuUtilization"
              fill="#8884d8"
              name="CPU Utilization (%)"
            />
            <Bar dataKey="totalTime" fill="#ff8042" name="Total Time" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}

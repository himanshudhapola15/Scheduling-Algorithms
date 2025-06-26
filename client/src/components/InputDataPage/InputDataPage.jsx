import { useState } from "react";
import InputForm from "../InputDataPage/InputForm";
import ResultTable from "../InputDataPage/ResultTable";
import GanttChart from "../InputDataPage/GanttChart";
import ComparisonChart from "../InputDataPage/ComparisonChart";
import { runFCFS } from "../../algorithm/fcfs.js";
import { runLJF } from "../../algorithm/ljf.js";
import { runSJF } from "../../algorithm/sjf.js";
import { runRR } from "../../algorithm/rr.js";
import { runPriority } from "../../algorithm/priority.js";
import Navbar from "../NavBar/NavBar.jsx";

export default function InputDataPage() {
  const [selectedAlgo, setSelectedAlgo] = useState("");
  const [processes, setProcesses] = useState([]);
  const [arrivalTime, setArrivalTime] = useState("");
  const [burstTime, setBurstTime] = useState("");
  const [priority, setPriority] = useState("");
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [result, setResult] = useState([]);
  const [ganttData, setGanttData] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [cpuUtilization, setCpuUtilization] = useState(0);
  const [avgWaitingTime, setAvgWaitingTime] = useState(0);
  const [avgTurnaroundTime, setAvgTurnaroundTime] = useState(0);
  const [comparisonData, setComparisonData] = useState([]);

  const addProcess = () => {
    if (arrivalTime === "" || burstTime === "") return;
    const newProcess = {
      id: processes.length + 1,
      arrivalTime: parseInt(arrivalTime),
      burstTime: parseInt(burstTime),
    };
    if (selectedAlgo === "priority" || selectedAlgo === "all") {
      if (priority === "") return;
      newProcess.priority = parseInt(priority);
    }
    setProcesses([...processes, newProcess]);
    setArrivalTime("");
    setBurstTime("");
    setPriority("");
  };

  const runSimulation = () => {
    if (selectedAlgo === "all") {
      const allResults = [
        { name: "FCFS", ...runFCFS(processes) },
        { name: "SJF", ...runSJF(processes) },
        { name: "LJF", ...runLJF(processes) },
        { name: "RR", ...runRR(processes, parseInt(timeQuantum)) },
        { name: "Priority", ...runPriority(processes) },
      ];
      setComparisonData(allResults);
      setResult([]);
      setGanttData([]);
      return;
    }

    let simulationResult;
    switch (selectedAlgo) {
      case "fcfs":
        simulationResult = runFCFS(processes);
        break;
      case "sjfs":
        simulationResult = runSJF(processes);
        break;
      case "ljfs":
        simulationResult = runLJF(processes);
        break;
      case "rr":
        simulationResult = runRR(processes, parseInt(timeQuantum));
        break;
      case "priority":
        simulationResult = runPriority(processes);
        break;
      default:
        console.error("Unknown algorithm selected.");
        return;
    }

    const {
      result,
      gantt,
      totalTime,
      avgWaitingTime,
      avgTurnaroundTime,
      cpuUtilization,
    } = simulationResult;

    setResult(result);
    setGanttData([]);
    setTotalTime(totalTime);
    setAvgWaitingTime(avgWaitingTime);
    setAvgTurnaroundTime(avgTurnaroundTime);
    setCpuUtilization(cpuUtilization);
    gantt.forEach((block, index) => {
      setTimeout(() => {
        setGanttData((prev) => [...prev, block]);
      }, index * 1000);
    });
  };


  return (
    <div className="text-white min-h-screen px-3 lg:px-0 bg-[#0A1F2B] pb-10">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-[#01090fcb] border border-sky-300 mt-10 rounded-2xl shadow-md p-6">
        <h1 className="text-3xl font-bold text-center text-white mb-4">
          CPU Scheduling Simulator
        </h1>

        <div className="mb-4">
          <label className="block font-medium mb-1 text-lg text-white">
            Select Algorithm:
          </label>
          <select
            value={selectedAlgo}
            onChange={(e) => {
              setProcesses([]);
              setArrivalTime("");
              setBurstTime("");
              setPriority("");
              setResult([]);
              setGanttData([]);
              setComparisonData([]);
              setTotalTime(0);
              setCpuUtilization(0);
              setAvgWaitingTime(0);
              setAvgTurnaroundTime(0);
              setSelectedAlgo(e.target.value);
            }}
            className="w-full border cursor-pointer border-slate-700 focus:outline-none rounded-xl px-3 py-2 bg-gray-700 text-white"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "none",
              appearance: "none",
              backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "32px 32px",
            }}
          >
            <option value="" className="text-gray-400">
              --Select--
            </option>
            <option value="fcfs">First Come First Serve</option>
            <option value="ljfs">Longest Job First</option>
            <option value="sjfs">Shortest Job First</option>
            <option value="rr">Round Robin</option>
            <option value="priority">Priority</option>
            <option value="all">All (Compare Algorithms)</option>
          </select>
        </div>

        {selectedAlgo !== "" && (
          <InputForm
            arrivalTime={arrivalTime}
            burstTime={burstTime}
            priority={priority}
            selectedAlgo={selectedAlgo}
            setSelectedAlgo={setSelectedAlgo}
            onArrivalChange={(e) => setArrivalTime(e.target.value)}
            onBurstChange={(e) => setBurstTime(e.target.value)}
            onPriorityChange={(e) => setPriority(e.target.value)}
            onAdd={addProcess}
          />
        )}

        {(selectedAlgo === "rr" || selectedAlgo === "all") && (
          <div className="mb-4">
            <label className="mb-1 font-medium">Time Quantum:</label>
            <input
              type="number"
              className="text-white w-full bg-gray-700 rounded-lg px-3 py-2 text-lg focus:outline-none transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(e.target.value)}
            />
          </div>
        )}

        {processes.length > 0 && (
          <div className="mb-4">
            <h2 className="font-medium mb-2 text-white text-lg">
              Process List:
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-300">
              {processes.map((p) => (
                <li key={p.id}>
                  P{p.id} - Arrival: {p.arrivalTime}, Burst: {p.burstTime}
                  {p.priority !== undefined && `, Priority: ${p.priority}`}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={runSimulation}
          disabled={processes.length === 0}
          className="cursor-pointer font-bold text-xl w-full mt-4 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 border-4 text-white py-1 px-2 rounded"
        >
          Run Simulation
        </button>

        {selectedAlgo !== "all" && result.length > 0 && (
          <div className="mt-6 space-y-6">
            <ResultTable
              result={result}
              totalTime={totalTime}
              avgWaitingTime={avgWaitingTime}
              avgTurnaroundTime={avgTurnaroundTime}
              cpuUtilization={cpuUtilization}
            />
            <GanttChart ganttData={ganttData} />
          </div>
        )}

        {selectedAlgo === "all" && comparisonData.length > 0 && (
          <ComparisonChart
            data={comparisonData.map((r) => ({
              name: r.name,
              avgWaitingTime: parseFloat(r.avgWaitingTime),
              avgTurnaroundTime: parseFloat(r.avgTurnaroundTime),
              cpuUtilization: parseFloat(r.cpuUtilization),
              totalTime: r.totalTime,
            }))}
          />
        )}
      </div>
    </div>
  );
}

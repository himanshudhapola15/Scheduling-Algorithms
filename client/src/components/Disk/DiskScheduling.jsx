
import { useState } from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from "recharts";
import Navbar from "../NavBar/NavBar";
import { calculateFCFS } from "../../algorithm/diskfcfs.js";
import { calculateSSTF } from "../../algorithm/disksstf.js";
import { calculateSCAN } from "../../algorithm/diskscan.js";
import { calculateLOOK } from "../../algorithm/disklook.js";

const DiskScheduling = () => {
  const [requests, setRequests] = useState("");
  const [head, setHead] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [result, setResult] = useState(null);

  const parseInput = (input) => {
    return input
      .split(" ")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const reqs = parseInput(requests);
    const headNum = parseInt(head);

    if (reqs.length === 0 || isNaN(headNum)) {
      alert("Please enter valid inputs.");
      return;
    }

    let res;
    switch (algorithm) {
      case "FCFS":
        res = calculateFCFS(reqs, headNum);
        break;
      case "SSTF":
        res = calculateSSTF(reqs, headNum);
        break;
      case "SCAN":
        res = calculateSCAN(reqs, headNum);
        break;
      case "LOOK":
        res = calculateLOOK(reqs, headNum);
        break;
      default:
        res = { sequence: [], seekTime: 0 };
    }

    setResult(res);
  };

  const getChartData = () => {
    if (!result) return [];
    let data = [{ step: 0, track: parseInt(head) }];
    result.sequence.forEach((track, index) => {
      data.push({ step: Number(index + 1), track });
    });
    return data;
  };

  const getGanttData = () => {
    if (!result) return [];
    let data = [];
    let current = parseInt(head);
    let time = 0;

    result.sequence.forEach((track, index) => {
      const duration = Math.abs(current - track);
      data.push({
        name: `R${index + 1}`,
        x: time,
        width: duration,
        track,
      });
      time += duration;
      current = track;
    });

    return data;
  };

  return (

    <div className="text-white min-h-screen px-3 lg:px-0 bg-[#0A1F2B] pb-20">

      <Navbar />
      <div className="max-w-4xl mx-auto bg-[#01090fcb] border border-sky-300 mt-10 rounded-2xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Disk Scheduling Simulator
        </h2>

        <form className="flex flex-col gap-3 mb-6" onSubmit={handleSubmit}>

          <label className="block font-medium text-lg text-white">

            Select Algorithm:
          </label>
          <select
            value={algorithm}
            onChange={(e) => {
              setAlgorithm(e.target.value);
              setRequests("");
              setHead("");
              setResult(null);
            }}
            className="w-full cursor-pointer border border-slate-700 focus:outline-none rounded-xl px-3 py-2 bg-gray-700 text-white appearance-none relative pr-8"
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

            <option value="FCFS">First Come First Serve</option>
            <option value="SSTF">Shortest Seek Time First</option>
            <option value="SCAN">SCAN</option>
            <option value="LOOK">LOOK</option>
          </select>

          <label className="block text-lg font-medium text-white">
            Requests:

          </label>
          <input
            type="text"
            placeholder="e.g. 98 183 37. . ."
            value={requests}
            onChange={(e) => setRequests(e.target.value)}
            className="w-full border mb-5 border-slate-700 focus:outline-none rounded-xl px-3 py-2 bg-gray-700 text-white"
          />

          <label className="block font-medium text-white text-lg">
            Initial Head:
          </label>

          <input
            type="number"
            placeholder="Enter Initial Head Position"
            value={head}
            onChange={(e) => setHead(e.target.value)}
            className="w-full border mb-5 border-slate-700 transition-all [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield] focus:outline-none rounded-xl px-3 py-2 bg-gray-700 text-white"
          />
          <button
            type="submit"

            className="cursor-pointer mt-6 font-bold text-xl w-full bg-teal-500 hover:bg-teal-700 border-4 border-teal-500 hover:border-teal-700 text-white py-1 px-2 rounded"
          >
            Run Simulation

          </button>
        </form>

        {result && (
          <div className="mt-8 text-gray-300">

            <p className="text-white">
              <strong className="text-gray-400">Seek Sequence:</strong>{" "}
              {result.sequence.join(" → ")}
            </p>
            <p className="text-white">
              <strong className="text-gray-400">Total Seek Time:</strong>{" "}
              {result.seekTime}
            </p>

            <h3 className="mt-8 mb-4 text-white text-lg font-semibold">
              Head Movement
            </h3>
            <div className="h-72 rounded-xl bg-gray-800 pt-6 pr-6">

              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()} layout="vertical">
                  <CartesianGrid stroke="#444" />
                  <XAxis type="number" dataKey="track" stroke="#ccc" />
                  <YAxis type="number" dataKey="step" stroke="#ccc" />
                  <Tooltip />
                  <Line
                    type="linear"
                    dataKey="track"
                    stroke="#00e0ff"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <h3 className="mt-8 mb-4 text-white text-lg font-semibold">
              Seek Timeline
            </h3>
            <div className="h-72 rounded-xl mt-4 bg-gray-800 pt-6 pr-6">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={getGanttData()}>
                  <CartesianGrid stroke="#444" />
                  <XAxis type="number" stroke="#ccc" />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#ccc"
                    width={40}
                  />
                  <Tooltip
                    formatter={(value, name, props) => {
                      const { payload } = props;
                      return [
                        `${value} tracks (to ${payload.track})`,
                        "Seek Time",
                      ];
                    }}
                  />
                  <Bar dataKey="width" fill="#6b5b95" minPointSize={1}>
                    <LabelList position="right" fill="#fff" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiskScheduling;

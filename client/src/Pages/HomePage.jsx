import { motion} from "framer-motion";
import Navbar from "../components/NavBar/NavBar";

export default function HomePage() {

  return (
    <div className="relative overflow-hidden bg-[#0A1F2B] min-h-screen text-white">
      <Navbar />
      <main className="relative z-10 flex flex-col items-center justify-center text-center pt-36 px-4 sm:px-6 lg:px-8">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold ">
          Smart Scheduling
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-blue-400">
            for efficient systems
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-gray-300">
          This project simulates core CPU and disk scheduling algorithms
          including FCFS, SJF, Round Robin, Priority, SSTF, SCAN, and more —
          providing clear visualizations and real-time analytics to help
          students and engineers understand and compare algorithm performance.
        </p>

        <div className="mt-10 flex space-x-10">
          <motion.a
            href="/file-upload"
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 border-2 font-bold border-gradient-to-r border-teal-300 border-opacity-70  rounded-lg bg-gradient-to-br from-blue-500/20 to-teal-500/20 backdrop-blur-md hover:from-blue-400/30 hover:to-teal-400/30 transition"
          >
            Upload
          </motion.a>
          <motion.a
            href="/docs"
            whileHover={{ scale: 1.05 }}
            className="px-6 py-3 border-2 border-gradient-to-r border-teal-300 border-opacity-70 font-bold rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/20 backdrop-blur-md hover:from-teal-400/30 hover:to-blue-400/30 transition"
          >
            Docs
          </motion.a>
        </div>
      </main>
    </div>
  );
}

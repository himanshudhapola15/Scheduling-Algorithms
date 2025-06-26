export default function InputForm({
  arrivalTime,
  burstTime,
  priority,
  selectedAlgo,
  onArrivalChange,
  onBurstChange,
  onPriorityChange,
  onAdd,
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap mb-4 justify-evenly">
      <div className="flex flex-col">
        <label className="mb-1 font-medium">Arrival Time:</label>
        <input
          type="number"
          className="bg-gray-700 focus:outline-none rounded px-3 py-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
          placeholder="e.g. 0"
          value={arrivalTime}
          onChange={onArrivalChange}
        />
      </div>


      <div className="flex flex-col mt-5 md:mt-0">
        <label className="mb-1 font-medium">Burst Time:</label>
        <input
          type="number"
          className="bg-gray-700 focus:outline-none rounded px-3 py-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
          placeholder="e.g. 5"
          value={burstTime}
          onChange={onBurstChange}
        />
      </div>

      {(selectedAlgo === "priority" || selectedAlgo === "all") && (
        <div className="flex flex-col mt-5 md:mt-0 ">
          <label className="mb-1 font-medium">Priority:</label>
          <input
            type="number"
            className="bg-gray-700 focus:outline-none rounded px-3 py-2 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]"
            placeholder="e.g. 2"
            value={priority}
            onChange={onPriorityChange}
          />
        </div>
      )}

      <div
        className={`flex items-end ${
          selectedAlgo === "priority" ? "mt-4" : ""
        }`}
      >
        <button
          onClick={onAdd}
          className="cursor-pointer mt-5 md:mt-0 font-bold flex-shrink-0 bg-white border-transparent border-4 text-teal-500 hover:text-teal-800 text-base px-8 py-1 rounded-xl"
        >
          Add
        </button>
      </div>
    </div>
  );
}

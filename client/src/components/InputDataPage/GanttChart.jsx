export default function GanttChart({ ganttData }) {
  if (ganttData.length === 0) return null;

  return (
    <div>
      <h2 className="font-medium mb-2 text-white text-lg">Gantt Chart:</h2>
      <div className="overflow-x-auto max-w-full">
        <div className="flex items-center space-x-1 border border-sky-300 p-3 rounded bg-gray-700 relative min-w-max">
          {ganttData.map((block, index) => (
            <div
              key={index}
              className={`${
                block.id === "Idle" ? "bg-gray-400" : "bg-teal-500"
              } text-white text-sm text-center rounded p-5 transition-all duration-500 shadow relative`}
              style={{ minWidth: `${block.duration * 45}px` }}
            >
              <div className="">
                {block.id === "Idle" ? "Idle" : `P${block.id}`}
              </div>
              <div className="text-xs">
                {block.start}-{block.start + block.duration}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { formatTime } from "../utils/timeUtils.js";

const ProcessBar = ({
  process,
  index,
  minTime,
  maxTime,
  timeScale,
  animate,
  isPlaying,
}) => {
  const [width, setWidth] = useState(
    animate ? 0 : process.burstTime * timeScale,
  );
  const [opacity, setOpacity] = useState(animate ? 0 : 1);

  const left = (process.startTime - minTime) * timeScale;
  const calculatedWidth = process.burstTime * timeScale;

  const colors = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const backgroundColor = colors[index % colors.length];

  useEffect(() => {
    if (animate && isPlaying) {
      setOpacity(1);

      const animationDuration = 1000; 
      let startTime = null;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);

        setWidth(calculatedWidth * progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    } else if (!animate) {
      setWidth(calculatedWidth);
      setOpacity(1);
    }
  }, [animate, calculatedWidth, isPlaying]);

  return (
    <div
      className="absolute flex items-center justify-center text-sm font-medium text-white transition-opacity rounded-md"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        height: "40px",
        backgroundColor,
        opacity,
        transition: animate ? "opacity 0.5s ease" : "none",
      }}
    >
      <div className="overflow-hidden text-xs whitespace-nowrap">
        {process.file}
      </div>

      <div
        className="absolute left-0 w-full p-1 text-xs bg-black bg-opacity-75 rounded-b-md -bottom-16"
        style={{ display: width > 100 ? "block" : "none" }}
      >
        <div>Arrival: {formatTime(process.arrivalTime)}</div>
        <div>Start: {formatTime(process.startTime)}</div>
        <div>Burst: {formatTime(process.burstTime)}</div>
      </div>
    </div>
  );
};

export default ProcessBar;

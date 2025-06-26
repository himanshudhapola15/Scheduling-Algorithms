import React from "react";
import { formatTime } from "../utils/timeUtils";

const Timeline = ({ minTime, maxTime, timeScale, width }) => {
  const timeRange = maxTime - minTime;
  const markerStep = timeRange > 10000 ? 2000 : 1000;

  const markers = [];
  for (let i = minTime; i <= maxTime; i += markerStep) {
    const position = (i - minTime) * timeScale;
    if (position <= width) {
      markers.push({
        time: i,
        position,
      });
    }
  }

  return (
    <div className="relative w-full h-8 mb-4">
      <div className="absolute left-0 w-full h-px bg-gray-300 top-4"></div>

      {markers.map((marker, index) => (
        <div
          key={index}
          className="absolute flex flex-col items-center"
          style={{ left: `${marker.position}px` }}
        >
          <div className="w-px h-2 bg-gray-400"></div>
          <div className="mt-1 text-xs text-gray-600">
            {formatTime(marker.time)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;

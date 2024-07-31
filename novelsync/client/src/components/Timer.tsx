import React, { useState, useEffect, ChangeEvent, MouseEvent } from "react";

const DigitalTimer: React.FC = () => {
  const [time, setTime] = useState<number>(0); // time in seconds
  const [isActive, setIsActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (!isActive && time !== 0) {
      if (interval) clearInterval(interval);
    }

    if (time === 0) {
      if (interval) clearInterval(interval);
      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const handleStartStop = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsActive(!isActive);
  };

  const handleReset = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsActive(false);
    setTime(0);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTime(Number(e.target.value) * 60);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div className="max-w-sm mx-auto p-4 mb-4 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Digital Timer</h2>
      <div className="mb-4">
        <input
          type="number"
          min="0"
          onChange={handleChange}
          placeholder="Set time in minutes"
          className="w-full p-2 border rounded-md"
        />
      </div>
      <div className="mb-4 text-3xl font-mono">{formatTime(time)}</div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={handleStartStop}
          className={`px-4 py-2 rounded-md ${
            isActive ? "bg-red-500" : "bg-green-500"
          } text-white`}
        >
          {isActive ? "Stop" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default DigitalTimer;

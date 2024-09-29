import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";

interface TimelineEvent {
  id: number;
  content: string;
}

interface Timeline {
  id: number;
  name: string;
  events: TimelineEvent[];
}

const PlotTimeline: React.FC = () => {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [nextTimelineId, setNextTimelineId] = useState(1);
  const [nextEventId, setNextEventId] = useState(1);

  const addTimeline = () => {
    const newTimeline: Timeline = {
      id: nextTimelineId,
      name: `Timeline ${nextTimelineId}`,
      events: [],
    };
    setTimelines([...timelines, newTimeline]);
    setNextTimelineId(nextTimelineId + 1);
  };

  const addEvent = (timelineId: number) => {
    setTimelines(
      timelines.map((timeline) => {
        if (timeline.id === timelineId) {
          return {
            ...timeline,
            events: [
              ...timeline.events,
              { id: nextEventId, content: `Event ${nextEventId}` },
            ],
          };
        }
        return timeline;
      })
    );
    setNextEventId(nextEventId + 1);
  };

  const removeTimeline = (timelineId: number) => {
    setTimelines(timelines.filter((timeline) => timeline.id !== timelineId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Multi-Timeline Tool</h1>
      <button
        onClick={addTimeline}
        className="mb-4 py-2 px-4 rounded-full bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 transition duration-300"
      >
        Add Timeline
      </button>

      <div className="flex">
        {/* Timeline management column */}
        <div className="space-y-16 w-64 pr-4 border-r">
          {timelines.map((timeline) => (
            <div className="rounded-lg shadow-lg p-4 bg-red-400">
              <div
                key={timeline.id}
                className="flex items-center justify-between p-2 rounded"
              >
                <span>{timeline.name}</span>
                <button onClick={() => removeTimeline(timeline.id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Timelines display area */}
        <div className="flex-1 pl-4">
          {timelines.map((timeline) => (
            <div key={timeline.id} className="">
              {/* <h2 className="text-xl font-semibold mb-2">{timeline.name}</h2> */}

              <div className="relative h-32 overflow-x-auto">
                <div className="absolute top-[2.5rem] left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2" />

                <AnimatePresence>
                  {timeline.events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-[-0.75rem] p-3 rounded-full transform -translate-y-1/2"
                      style={{ left: `${index * 220}px` }}
                    >
                      <div className="w-48 bg-blue-500 rounded-lg shadow-lg p-4 text-white">
                        <h3 className="font-bold text-lg mb-2">
                          {event.content}
                        </h3>
                        <div className="text-sm">Click to edit</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addEvent(timeline.id)}
                  className="absolute top-[2.5rem] p-3 pl-4 pr-6 flex items-center space-x-2 rounded-full transform -translate-y-1/2 z-10 bg-gray-200 "
                  style={{ left: `${timeline.events.length * 220}px` }}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add Event</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlotTimeline;

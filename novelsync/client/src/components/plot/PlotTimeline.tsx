import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronDown, PlusCircle, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TemplateData, templateData } from "@/components/data/templateData";
import { TimelineEditModal } from "./TimelineEditModal";
import { EventEditModal } from "./EventEditModal";

interface TimelineEvent {
  id: number;
  name: string;
  content: string;
}

interface Timeline {
  id: number;
  name: string;
  description: string;
  events: TimelineEvent[];
}

const PlotTimeline: React.FC = () => {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [nextTimelineId, setNextTimelineId] = useState(1);
  const [nextEventId, setNextEventId] = useState(1);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<Timeline | null>(null);

  const [editingEvent, setEditingEvent] = useState<{
    timelineId: number;
    event: TimelineEvent;
  } | null>(null);

  const addTimeline = () => {
    const newTimeline: Timeline = {
      id: nextTimelineId,
      name: `New Plot`,
      description: "",
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
              {
                id: nextEventId,
                name: `Event ${nextEventId}`,
                content: `Event ${nextEventId}`,
              },
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

  const handleSaveTimeline = () => {
    if (editingTimeline) {
      setTimelines(
        timelines.map((timeline) =>
          timeline.id === editingTimeline.id ? editingTimeline : timeline
        )
      );
      closeEditTimelineModal();
    }
  };

  const handleSaveEvent = () => {
    if (editingEvent) {
      setTimelines(
        timelines.map((timeline) =>
          timeline.id === editingEvent.timelineId
            ? {
                ...timeline,
                events: timeline.events.map((event) =>
                  event.id === editingEvent.event.id
                    ? editingEvent.event
                    : event
                ),
              }
            : timeline
        )
      );
      closeEditEventModal();
    }
  };

  const addTimelineFromTemplate = (template: TemplateData) => {
    const newTimeline: Timeline = {
      id: nextTimelineId,
      name: template.name,
      description: `Timeline based on the ${template.name} template`,
      events: template.items.map((item) => ({
        id: nextEventId + item.id - 1,
        name: item.name,
        content: item.content,
      })),
    };
    setTimelines([...timelines, newTimeline]);
    setNextTimelineId(nextTimelineId + 1);
    setNextEventId(nextEventId + template.items.length);
  };

  const openEditTimelineModal = (timeline: Timeline) => {
    setEditingTimeline(timeline);
    setIsTimelineModalOpen(true);
  };

  const closeEditTimelineModal = () => {
    setIsTimelineModalOpen(false);
    setEditingTimeline(null);
  };

  const openEditEventModal = (timelineId: number, event: TimelineEvent) => {
    setEditingEvent({ timelineId, event: { ...event } });
    setIsEventModalOpen(true);
  };

  const closeEditEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={addTimeline}
          className="mb-4 py-2 px-4 rounded-sm bg-amber-600 text-white flex items-center justify-center hover:bg-amber-700 transition duration-300"
        >
          Add Plot
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200 hover:text-amber-900"
            >
              <Book className="mr-2 h-4 w-4" />
              Plot Templates
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-amber-50 border border-amber-200 shadow-lg rounded-md p-1 min-w-[200px]">
            {templateData.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onSelect={() => addTimelineFromTemplate(template)}
                className="px-4 py-2 hover:bg-amber-100 text-amber-800 hover:text-amber-900 rounded-sm cursor-pointer transition-colors duration-150 ease-in-out"
              >
                <span className="font-serif">{template.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex">
        {/* Timeline management column */}
        <div className="space-y-16 w-64 pr-4 border-r">
          {timelines.map((timeline) => (
            <div
              key={timeline.id}
              className="rounded-lg shadow-lg p-4 bg-red-400"
            >
              <div
                className="flex items-center justify-between p-2 rounded cursor-pointer"
                onClick={() => openEditTimelineModal(timeline)}
              >
                <span>{timeline.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTimeline(timeline.id);
                  }}
                >
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
                      onClick={() => openEditEventModal(timeline.id, event)}
                    >
                      <div className="w-48 bg-blue-500 rounded-lg shadow-lg p-4 text-white cursor-pointer hover:bg-blue-600 transition-colors duration-200">
                        <h3 className="font-bold text-lg mb-2">{event.name}</h3>
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
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TimelineEditModal
        isOpen={isTimelineModalOpen}
        onClose={closeEditTimelineModal}
        onSave={handleSaveTimeline}
        editingTimeline={editingTimeline}
        setEditingTimeline={setEditingTimeline}
      />

      <EventEditModal
        isOpen={isEventModalOpen}
        onClose={closeEditEventModal}
        onSave={handleSaveEvent}
        editingEvent={editingEvent}
        setEditingEvent={setEditingEvent}
      />
    </div>
  );
};

export default PlotTimeline;

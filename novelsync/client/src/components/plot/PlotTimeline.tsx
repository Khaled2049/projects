import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PlotLineEditModal } from "./PlotlineEditModal";
import { EventEditModal } from "./EventEditModal";
import { PlotEvent, PlotLine, TemplateData } from "@/types/IPlot";
import { plotService } from "./PlotService";
import { useParams } from "react-router-dom";

const PlotTimeline: React.FC = () => {
  const [plotLines, setPlotLines] = useState<PlotLine[]>([]);
  const { storyId } = useParams<{ storyId: string }>();

  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [isPlotLineModalOpen, setisPlotLineModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingPlotLine, setEditingPlotLine] = useState<PlotLine | null>(null);
  const [editingEvent, setEditingEvent] = useState<{
    plotLineId: string;
    event: PlotEvent;
  } | null>(null);

  useEffect(() => {
    loadPlots();
  }, [storyId]);

  const loadPlots = async () => {
    if (!storyId) return;

    const plots = await plotService.getPlots(storyId);
    setPlotLines(plots);

    const data = await plotService.loadTemplateData();
    setTemplates(data);
  };

  const addPlotLine = async () => {
    if (!storyId) return;

    const plotId = await plotService.addPlot(storyId, "New PlotLine");
    setPlotLines([
      ...plotLines,
      {
        id: plotId,
        name: "New PlotLine",
        description: "",
        events: [],
        userId: "",
      },
    ]);
  };

  const addEvent = async (plotLineId: string) => {
    console.log("Adding event to plotline:", plotLineId);

    const newEvent: PlotEvent = {
      id: new Date().getTime().toString(),
      name: "New Event",
      content: "",
    };
    if (!storyId) return;

    const eventId = await plotService.addEvent(storyId, plotLineId, newEvent);
    setPlotLines(
      plotLines.map((plotLine) =>
        plotLine.id === plotLineId
          ? {
              ...plotLine,
              events: [
                ...plotLine.events,
                { ...newEvent, id: eventId } as PlotEvent,
              ],
            }
          : plotLine
      )
    );
  };

  const removePlotline = async (plotLineId: string) => {
    if (!storyId) return;
    await plotService.deletePlot(storyId, plotLineId);
    setPlotLines(plotLines.filter((plotLine) => plotLine.id !== plotLineId));
  };

  const handleSavePlotLineModal = async () => {
    if (!storyId || !editingPlotLine) return;
    await plotService.updatePlot(storyId, editingPlotLine);
    if (editingPlotLine) {
      setPlotLines(
        plotLines.map((plotLine) =>
          plotLine.id === editingPlotLine.id ? editingPlotLine : plotLine
        )
      );
      closeEditPlotLineModal();
    }
  };

  const handleSaveEvent = async () => {
    if (!storyId || !editingEvent) return;

    if (editingEvent) {
      await plotService.updateEvent(
        storyId,
        editingEvent.plotLineId,
        editingEvent.event
      );
      setPlotLines(
        plotLines.map((plotLine) =>
          plotLine.id === editingEvent.plotLineId
            ? {
                ...plotLine,
                events: plotLine.events.map((event) =>
                  event.id === editingEvent.event.id
                    ? editingEvent.event
                    : event
                ),
              }
            : plotLine
        )
      );
      closeEditEventModal();
    }
  };

  // const addPlotLineFromTemplate = (template: TemplateData) => {
  //   const newPlotLine: PlotLine = {
  //     id: nextplotLineId,
  //     name: template.name,
  //     description: `Timeline based on the ${template.name} template`,
  //     events: template.items.map((item) => ({
  //       id: nextEventId + item.id - 1,
  //       name: item.name,
  //       content: item.content,
  //     })),
  //   };
  //   setPlotLines([...plotLines, newPlotLine]);
  //   setNextplotLineId(nextplotLineId + 1);
  //   setNextEventId(nextEventId + template.items.length);
  // };

  const openEditPlotlineModal = (plotLine: PlotLine) => {
    setEditingPlotLine(plotLine);
    setisPlotLineModalOpen(true);
  };

  const closeEditPlotLineModal = () => {
    setisPlotLineModalOpen(false);
    setEditingPlotLine(null);
  };

  const openEditEventModal = (plotLineId: string, event: PlotEvent) => {
    setEditingEvent({ plotLineId, event: { ...event } });
    setIsEventModalOpen(true);
  };

  const closeEditEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const addPlotLineFromTemplate = async (template: TemplateData) => {
    console.log("Adding plotline from template:", template);

    if (!storyId) {
      console.error("No storyId provided");
      return;
    }

    try {
      // Add the plot first
      const plotId = await plotService.addPlot(storyId, template.name);

      // Prepare all events to be added
      const eventPromises = template.events.map((e, idx) => {
        const plotEvent = {
          content: e.content,
          name: e.name,
          id: idx.toString(),
        };
        return plotService.addEvent(storyId, plotId, plotEvent);
      });

      // Add all events concurrently
      await Promise.all(eventPromises);

      console.log(
        `Successfully added plot "${template.name}" with ${template.events.length} events`
      );

      // Reload the plots
      loadPlots();
    } catch (error) {
      console.error("Error adding plot line from template:", error);
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <button
          onClick={addPlotLine}
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
            {templates.map((template, idx) => (
              <DropdownMenuItem
                key={idx}
                onSelect={() => addPlotLineFromTemplate(template)}
                className="px-4 py-2 hover:bg-amber-100 text-amber-800 hover:text-amber-900 rounded-sm cursor-pointer transition-colors duration-150 ease-in-out"
              >
                <span className="font-serif">{template.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex">
        {/* PlotLine management column */}
        <div className="space-y-16 w-64 pr-4 border-r">
          {plotLines.map((plotLine) => (
            <div
              key={plotLine.id}
              className="rounded-lg shadow-lg p-4 bg-red-400"
            >
              <div
                className="flex items-center justify-between p-2 rounded cursor-pointer"
                onClick={() => openEditPlotlineModal(plotLine)}
              >
                <span>{plotLine.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePlotline(plotLine.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* plotLines display area */}
        <div className="flex-1 pl-4">
          {plotLines.map((plotLine) => (
            <div key={plotLine.id} className="">
              <div className="relative h-32 overflow-x-auto">
                <div className="absolute top-[2.5rem] left-0 right-0 h-1 bg-gray-300 transform -translate-y-1/2" />

                <AnimatePresence>
                  {plotLine.events.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 50 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-[-0.75rem] p-3 rounded-full transform -translate-y-1/2"
                      style={{ left: `${index * 220}px` }}
                      onClick={() => openEditEventModal(plotLine.id, event)}
                    >
                      <div className="w-48 bg-blue-500 rounded-lg shadow-lg p-4 text-white cursor-pointer hover:bg-blue-600 transition-colors duration-200">
                        <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                        <div className="text-sm">Click to edit</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                <button
                  onClick={() => addEvent(plotLine.id)}
                  className="absolute top-[2.5rem] p-3 pl-4 pr-6 flex items-center space-x-2 rounded-full transform -translate-y-1/2 z-10 bg-gray-200 "
                  style={{ left: `${plotLine.events.length * 220}px` }}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <PlotLineEditModal
        isOpen={isPlotLineModalOpen}
        onClose={closeEditPlotLineModal}
        onSave={handleSavePlotLineModal}
        editingPlotLine={editingPlotLine}
        setEditingPlotLine={setEditingPlotLine}
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

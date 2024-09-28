import React, { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { PlusCircle, X, GripVertical } from "lucide-react";

interface PlotItem {
  id: string;
  content: string;
}

const demoData: PlotItem[] = [
  { id: "1", content: "Opening scene: Introduce main character" },
  {
    id: "2",
    content: "Inciting incident: Character discovers a mysterious artifact",
  },
  {
    id: "3",
    content: "First plot point: Character decides to embark on a journey",
  },
];

const Plot: React.FC = () => {
  const [items, setItems] = useState<PlotItem[]>(demoData);
  const [newScene, setNewScene] = useState("");
  const dragControls = useDragControls();

  const handleDragEnd = (event: any, info: any, index: number) => {
    const updatedItems = [...items];
    const { offset } = info;
    const newIndex = Math.round(offset.y / 60) + index; // Adjust 60 based on your item height
    const [movedItem] = updatedItems.splice(index, 1);
    updatedItems.splice(newIndex, 0, movedItem);
    setItems(updatedItems);
  };

  const addScene = () => {
    if (newScene.trim() !== "") {
      setItems([...items, { id: Date.now().toString(), content: newScene }]);
      setNewScene("");
    }
  };

  const deleteScene = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="p-6 bg-amber-50 min-h-screen">
      <h1 className="text-3xl font-bold text-amber-800 mb-6">Plot Timeline</h1>

      <div className="mb-4 flex">
        <input
          type="text"
          value={newScene}
          onChange={(e) => setNewScene(e.target.value)}
          placeholder="Enter new scene description"
          className="flex-grow p-2 border border-amber-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          onClick={addScene}
          className="bg-amber-600 text-white px-4 py-2 rounded-r-md hover:bg-amber-700 transition-colors flex items-center"
        >
          <PlusCircle size={20} className="mr-2" />
          Add Scene
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            drag="y"
            dragControls={dragControls}
            onDragEnd={(event, info) => handleDragEnd(event, info, index)}
            className="bg-white p-4 rounded-md shadow-md flex items-center"
          >
            <GripVertical
              size={20}
              className="mr-2 cursor-move text-amber-600"
              onPointerDown={(e) => dragControls.start(e)}
            />
            <span className="flex-grow">{item.content}</span>
            <button
              onClick={() => deleteScene(item.id)}
              className="text-red-500 hover:text-red-700 transition-colors ml-2"
            >
              <X size={20} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Plot;

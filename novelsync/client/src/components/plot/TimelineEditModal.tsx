import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

interface TimelineEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingTimeline: Timeline | null;
  setEditingTimeline: (timeline: Timeline | null) => void;
}

export const TimelineEditModal: React.FC<TimelineEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTimeline,
  setEditingTimeline,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Timeline</DialogTitle>
        </DialogHeader>
        {editingTimeline && (
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <Input
                id="name"
                value={editingTimeline.name}
                onChange={(e) =>
                  setEditingTimeline({
                    ...editingTimeline,
                    name: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="description"
                value={editingTimeline.description}
                onChange={(e) =>
                  setEditingTimeline({
                    ...editingTimeline,
                    description: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

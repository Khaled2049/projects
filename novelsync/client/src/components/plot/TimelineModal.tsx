import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

const TimelineModal = () => {
  const handleSave = () => {
    if (editingTimeline) {
      setTimelines(
        timelines.map((timeline) =>
          timeline.id === editingTimeline.id ? editingTimeline : timeline
        )
      );
      closeEditModal();
    }
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
          <Button onClick={closeEditModal} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TimelineModal;

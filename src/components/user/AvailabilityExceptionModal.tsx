import { useState } from "react";
import { Button, Modal } from "../../components/ui";

export interface AvailabilityException {
  id: number;
  type: "Time Off" | "Extra Availability";
  date: string;
  startTime: string;
  endTime: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (exception: AvailabilityException) => void;
}

export default function AvailabilityExceptionModal({
  open,
  onClose,
  onSave,
}: Props) {
  const [type, setType] =
    useState<AvailabilityException["type"]>("Time Off");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleSave = () => {
    if (!date) return;

    onSave({
      id: Date.now(),
      type,
      date,
      startTime,
      endTime,
    });

    setType("Time Off");
    setDate("");
    setStartTime("");
    setEndTime("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Availability Exception"
    >
      <div className="space-y-4">
        <div>
          <label className="mb-2 block font-medium">
            Exception Type
          </label>

          <select
            value={type}
            onChange={(e) =>
              setType(
                e.target.value as AvailabilityException["type"]
              )
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="Time Off">Time Off</option>
            <option value="Extra Availability">
              Extra Availability
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              Start Time
            </label>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              End Time
            </label>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full rounded-lg border p-3"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={!date}>
            Add Exception
          </Button>
        </div>
      </div>
    </Modal>
  );
}
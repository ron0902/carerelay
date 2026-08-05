import { useState } from "react";
import { Button, Modal } from "../../components/ui";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export default function VisitNotesModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    bloodPressure: "",
    temperature: "",
    pulseRate: "",
    painLevel: "",
    mood: "",
    notes: "",
    recommendation: "",
  });

  const handleSubmit = () => {
    console.log(form);
    onSubmit();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Visit Notes"
    >
      <div className="space-y-4">

        <div className="grid grid-cols-2 gap-4">

          <input
            className="rounded-lg border p-3"
            placeholder="Blood Pressure"
            value={form.bloodPressure}
            onChange={(e) =>
              setForm({
                ...form,
                bloodPressure: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Temperature"
            value={form.temperature}
            onChange={(e) =>
              setForm({
                ...form,
                temperature: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Pulse Rate"
            value={form.pulseRate}
            onChange={(e) =>
              setForm({
                ...form,
                pulseRate: e.target.value,
              })
            }
          />

          <input
            className="rounded-lg border p-3"
            placeholder="Pain Level"
            value={form.painLevel}
            onChange={(e) =>
              setForm({
                ...form,
                painLevel: e.target.value,
              })
            }
          />

        </div>

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Patient Mood"
          value={form.mood}
          onChange={(e) =>
            setForm({
              ...form,
              mood: e.target.value,
            })
          }
        />

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          placeholder="Care Notes"
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
        />

        <textarea
          rows={3}
          className="w-full rounded-lg border p-3"
          placeholder="Recommendations"
          value={form.recommendation}
          onChange={(e) =>
            setForm({
              ...form,
              recommendation: e.target.value,
            })
          }
        />

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
          >
            Submit Visit
          </Button>

        </div>

      </div>
    </Modal>
  );
}
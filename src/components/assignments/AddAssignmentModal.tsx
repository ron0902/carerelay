import { useEffect, useState } from "react";
import { Button, Modal } from "../../components/ui";
import { type CareAssignment } from "../../types/assignment";

interface AddAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (assignment: CareAssignment) => void;
  assignment?: CareAssignment | null;
}

export default function AddAssignmentModal({
  open,
  onClose,
  onSave,
  assignment,
}: AddAssignmentModalProps) {
  const [form, setForm] = useState({
    patientName: "",
    caregiverName: "",
    organizationName: "",
    startDate: "",
    endDate: "",
    priority: "Medium" as "Low" | "Medium" | "High",
    status: "Pending" as
      | "Pending"
      | "Active"
      | "Completed"
      | "Cancelled",
    notes: "",
  });

  useEffect(() => {
    if (assignment) {
      setForm({
        patientName: assignment.patientName,
        caregiverName: assignment.caregiverName,
        organizationName: assignment.organizationName,
        startDate: assignment.startDate,
        endDate: assignment.endDate,
        priority: assignment.priority,
        status: assignment.status,
        notes: assignment.notes,
      });
    } else {
      setForm({
        patientName: "",
        caregiverName: "",
        organizationName: "",
        startDate: "",
        endDate: "",
        priority: "Medium",
        status: "Pending",
        notes: "",
      });
    }
  }, [assignment, open]);

  const handleSave = () => {
    onSave({
      id: assignment?.id ?? Date.now(),
      ...form,
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        assignment
          ? "Edit Assignment"
          : "Create Care Assignment"
      }
    >
      <div className="space-y-4">

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Patient Name"
          value={form.patientName}
          onChange={(e) =>
            setForm({
              ...form,
              patientName: e.target.value,
            })
          }
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Caregiver Name"
          value={form.caregiverName}
          onChange={(e) =>
            setForm({
              ...form,
              caregiverName: e.target.value,
            })
          }
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Organization"
          value={form.organizationName}
          onChange={(e) =>
            setForm({
              ...form,
              organizationName: e.target.value,
            })
          }
        />

        <div className="grid grid-cols-2 gap-4">

          <input
            type="date"
            className="rounded-lg border p-3"
            value={form.startDate}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
          />

          <input
            type="date"
            className="rounded-lg border p-3"
            value={form.endDate}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value,
              })
            }
          />

        </div>

        <div className="grid grid-cols-2 gap-4">

          <select
            className="rounded-lg border p-3"
            value={form.priority}
            onChange={(e) =>
              setForm({
                ...form,
                priority: e.target.value as
                  | "Low"
                  | "Medium"
                  | "High",
              })
            }
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            className="rounded-lg border p-3"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value as
                  | "Pending"
                  | "Active"
                  | "Completed"
                  | "Cancelled",
              })
            }
          >
            <option>Pending</option>
            <option>Active</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>

        </div>

        <textarea
          rows={4}
          className="w-full rounded-lg border p-3"
          placeholder="Notes..."
          value={form.notes}
          onChange={(e) =>
            setForm({
              ...form,
              notes: e.target.value,
            })
          }
        />

        <div className="flex justify-end gap-3 pt-4">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {assignment ? "Update" : "Save"}
          </Button>

        </div>

      </div>
    </Modal>
  );
}
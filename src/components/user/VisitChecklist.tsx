import { useState } from "react";
import { Button, Card } from "../../components/ui";

interface Props {
  onComplete: (checklist: Record<string, boolean>) => void;
}

export default function VisitChecklist({
  onComplete,
}: Props) {
  const [checklist, setChecklist] = useState({
    arrived: false,
    medication: false,
    vitals: false,
    mobility: false,
    hygiene: false,
    meal: false,
    notesReviewed: false,
  });

  const toggle = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const checklistComplete = Object.values(checklist).every(Boolean);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            Care Checklist
          </h2>

          <p className="text-gray-500">
            Complete all applicable tasks before finishing
            the visit.
          </p>
        </div>

        <div className="space-y-3">

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checklist.arrived}
              onChange={() => toggle("arrived")}
            />
            Arrived at Patient's Home
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checklist.medication}
              onChange={() => toggle("medication")}
            />
            Medication Administered
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checklist.vitals}
              onChange={() => toggle("vitals")}
            />
            Vital Signs Checked
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checklist.mobility}
              onChange={() => toggle("mobility")}
            />
            Mobility Assistance Provided
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checklist.hygiene}
              onChange={() => toggle("hygiene")}
            />
            Personal Hygiene Assisted
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checklist.meal}
              onChange={() => toggle("meal")}
            />
            Meal Assistance Completed
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={checklist.notesReviewed}
              onChange={() => toggle("notesReviewed")}
            />
            Care Plan Reviewed
          </label>

        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => onComplete(checklist)}
            disabled={!checklistComplete}
          >
            Complete Checklist
          </Button>
        </div>
      </div>
    </Card>
  );
}
import { Button, Modal } from "../../components/ui";

export interface VisitShift {
  id: number;
  patientId: number | null;
  patient: string;
  date: string;
  time: string;
  status: string;
  service?: string;
  location?: string;
}

export interface CarePlan {
  title: string;
  diagnosis: string | null;
  care_goal: string;
  medications: string | null;
  instructions: string | null;
  start_date: string;
  end_date: string | null;
}

interface VisitDetailsModalProps {
  open: boolean;
  shift: VisitShift | null;
  onClose: () => void;
  onStartChecklist: () => void;
  carePlan: CarePlan | null;
  loadingCarePlan: boolean;
}

export default function VisitDetailsModal({
  open,
  shift,
  onClose,
  onStartChecklist,
  carePlan,
  loadingCarePlan,
}: VisitDetailsModalProps) {
  if (!shift) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Visit Details"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">
            {shift.patient}
          </h2>

          <p className="text-gray-500">
            Assigned Patient
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-gray-500">Visit Date</p>
            <p className="font-medium">{shift.date}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Visit Time</p>
            <p className="font-medium">{shift.time}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-medium">{shift.service ?? "Home Care"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{shift.location ?? "TBD"}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <p className="font-medium">{shift.status}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Emergency Contact
            </p>
            <p className="font-medium">Not available</p>
          </div>
        </div>

        <div>
          <h3 className="mb-2 font-semibold">
            Care Plan
          </h3>

          {loadingCarePlan ? (
            <p className="text-gray-500">Loading care plan...</p>
          ) : carePlan ? (
            <div className="space-y-3 rounded-lg bg-gray-50 p-4 text-gray-700">
              <div>
                <p className="font-semibold">{carePlan.title}</p>
                {carePlan.diagnosis && (
                  <p className="text-sm text-gray-500">{carePlan.diagnosis}</p>
                )}
              </div>
              <PlanValue label="Care Goal" value={carePlan.care_goal} />
              <PlanValue label="Medications" value={carePlan.medications} />
              <PlanValue label="Instructions" value={carePlan.instructions} />
              <p className="text-xs text-gray-500">
                Active from {carePlan.start_date}
                {carePlan.end_date ? ` through ${carePlan.end_date}` : ""}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">No active care plan found.</p>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>

          {(shift.status === "Pending" ||
            shift.status === "Approved" ||
            shift.status === "In Progress") && (
            <Button onClick={onStartChecklist}>
              Start Care Checklist
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

function PlanValue({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm">{value || "Not provided"}</p>
    </div>
  );
}
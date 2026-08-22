import {
  CalendarDays,
  Clock,
  User,
  UserCog,
  Stethoscope,
  FileText,
} from "lucide-react";

import { Button, Modal } from "../../components/ui";
import { type Appointment } from "../../types/appointment";
import AppointmentStatusBadge from "./AppointmentStatusBadge";

interface ViewAppointmentModalProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

const formatVisitNotes = (notes: string) => {
  if (!notes) return null;

  try {
    const parsed = JSON.parse(notes);
    if (!parsed.visit_report) return null;

    return parsed as {
      visit_report: {
        checklist?: Record<string, boolean>;
        blood_pressure?: string;
        temperature?: string;
        pulse_rate?: string;
        pain_level?: string;
        mood?: string;
        care_notes?: string;
        recommendation?: string;
        submitted_at?: string;
      };
      previous_notes?: string | null;
    };
  } catch {
    return null;
  }
};

const checklistLabels: Record<string, string> = {
  arrived: "Arrived at patient's home",
  medication: "Medication administered",
  vitals: "Vital signs checked",
  mobility: "Mobility assistance provided",
  hygiene: "Personal hygiene assisted",
  meal: "Meal assistance completed",
  notesReviewed: "Care plan reviewed",
};

function ReportValue({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className={`mt-1 text-sm text-gray-800 ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

export default function ViewAppointmentModal({
  open,
  appointment,
  onClose,
}: ViewAppointmentModalProps) {
  if (!appointment) return null;

  const formattedVisit = formatVisitNotes(appointment.notes);
  const report = formattedVisit?.visit_report;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Appointment Details"
    >
      <div className="space-y-6">

        <div className="grid grid-cols-2 gap-5">

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <User size={16} />
              Patient
            </p>

            <p className="font-semibold">
              {appointment.patientName}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <UserCog size={16} />
              Caregiver
            </p>

            <p className="font-semibold">
              {appointment.caregiverName}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <CalendarDays size={16} />
              Appointment Date
            </p>

            <p className="font-semibold">
              {appointment.appointmentDate}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Clock size={16} />
              Appointment Time
            </p>

            <p className="font-semibold">
              {appointment.appointmentTime}
            </p>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-2 text-sm text-gray-500">
              <Stethoscope size={16} />
              Service
            </p>

            <p className="font-semibold">
              {appointment.service || appointment.appointmentType || "-"}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-500">
              Organization
            </p>

            <p className="font-semibold">
              {appointment.organizationName || "Not specified"}
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-500">
              Duration
            </p>

            <p className="font-semibold">
              {appointment.duration} minutes
            </p>
          </div>

          <div>
            <p className="mb-1 text-sm text-gray-500">Status</p>
            <AppointmentStatusBadge status={appointment.status} />
          </div>

        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <FileText size={16} />
            Reason
          </p>
          <div className="rounded-lg bg-gray-50 p-4">
            {appointment.reason || "No reason provided."}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-gray-500">
            Location
          </p>
          <div className="rounded-lg bg-gray-50 p-4">
            {appointment.location || "No location provided."}
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-2 text-sm text-gray-500">
            <FileText size={16} />
            Notes
          </p>
          {report ? (
            <div className="space-y-4 rounded-lg bg-gray-50 p-4">
              <div>
                <h3 className="font-semibold text-gray-800">Visit Report</h3>
                {report.submitted_at && (
                  <p className="mt-1 text-xs text-gray-500">
                    Submitted {new Date(report.submitted_at).toLocaleString()}
                  </p>
                )}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">Checklist</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {Object.entries(report.checklist ?? {}).map(([key, complete]) => (
                    <div key={key} className="flex items-center gap-2 text-sm">
                      <span className={complete ? "text-green-600" : "text-red-600"}>
                        {complete ? "Completed" : "Not completed"}
                      </span>
                      <span>{checklistLabels[key] ?? key}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-600">Vitals</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <ReportValue label="Blood Pressure" value={report.blood_pressure} />
                  <ReportValue label="Temperature" value={report.temperature} />
                  <ReportValue label="Pulse Rate" value={report.pulse_rate} />
                  <ReportValue label="Pain Level" value={report.pain_level} />
                </div>
              </div>

              <ReportValue label="Patient Mood" value={report.mood} />
              <ReportValue label="Care Notes" value={report.care_notes} multiline />
              <ReportValue label="Recommendations" value={report.recommendation} multiline />
            </div>
          ) : (
            <div className="rounded-lg bg-gray-50 p-4">
              {appointment.notes || "No notes available."}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t pt-5">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}
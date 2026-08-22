import { Button, Modal } from "../ui";

interface PatientVisitReportModalProps {
  open: boolean;
  notes: string | null;
  onClose: () => void;
}

const labels: Record<string, string> = {
  arrived: "Arrived at patient's home",
  medication: "Medication administered",
  vitals: "Vital signs checked",
  mobility: "Mobility assistance provided",
  hygiene: "Personal hygiene assisted",
  meal: "Meal assistance completed",
  notesReviewed: "Care plan reviewed",
};

export default function PatientVisitReportModal({
  open,
  notes,
  onClose,
}: PatientVisitReportModalProps) {
  let report: any = null;

  try {
    const parsed = notes ? JSON.parse(notes) : null;
    report = parsed?.visit_report ?? null;
  } catch {
    report = null;
  }

  return (
    <Modal open={open} onClose={onClose} title="Visit Report">
      {!report ? (
        <p className="text-gray-500">No visit report is available.</p>
      ) : (
        <div className="space-y-5">
          {report.submitted_at && (
            <p className="text-sm text-gray-500">
              Submitted {new Date(report.submitted_at).toLocaleString()}
            </p>
          )}

          <section>
            <h3 className="mb-2 font-semibold">Completed Checklist</h3>
            <div className="grid gap-2 sm:grid-cols-2">
              {Object.entries(report.checklist ?? {}).map(([key, value]) => (
                <p key={key} className="text-sm text-gray-700">
                  <span className={value ? "text-green-600" : "text-red-600"}>
                    {value ? "Completed" : "Not completed"}
                  </span>{" "}
                  {labels[key] ?? key}
                </p>
              ))}
            </div>
          </section>

          <section>
            <h3 className="mb-2 font-semibold">Vitals</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <ReportValue label="Blood Pressure" value={report.blood_pressure} />
              <ReportValue label="Temperature" value={report.temperature} />
              <ReportValue label="Pulse Rate" value={report.pulse_rate} />
              <ReportValue label="Pain Level" value={report.pain_level} />
            </div>
          </section>

          <ReportValue label="Patient Mood" value={report.mood} />
          <ReportValue label="Care Notes" value={report.care_notes} multiline />
          <ReportValue label="Recommendations" value={report.recommendation} multiline />

          <div className="flex justify-end border-t pt-4">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

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
    <div className={multiline ? "rounded-lg bg-gray-50 p-3" : ""}>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`mt-1 text-gray-800 ${multiline ? "whitespace-pre-wrap" : "font-medium"}`}>
        {value || "Not provided"}
      </p>
    </div>
  );
}

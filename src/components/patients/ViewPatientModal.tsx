import { Button, Modal } from "../../components/ui";
import { type Patient } from "../../types/patient";

interface ViewPatientModalProps {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
}

export default function ViewPatientModal({
  open,
  patient,
  onClose,
}: ViewPatientModalProps) {
  if (!patient) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Patient Details"
    >
      <div className="space-y-6">

        {/* Patient Header */}
        <div className="flex items-center gap-4 border-b pb-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <span className="text-xl font-bold">
              {patient.name.charAt(0).toUpperCase()}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {patient.name}
            </h2>

            <p className="text-sm text-gray-500">
              PAT-{String(patient.id).padStart(4, "0")}
            </p>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Basic Information
          </h3>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="font-semibold text-gray-800">
                {patient.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Age
              </p>

              <p className="font-semibold text-gray-800">
                {patient.age} years
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Gender
              </p>

              <p className="font-semibold text-gray-800">
                {patient.gender}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Blood Type
              </p>

              <p className="font-semibold text-gray-800">
                {patient.bloodType || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  patient.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {patient.status}
              </span>
            </div>

          </div>
        </div>

        {/* Contact Information */}
        <div className="border-t pt-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Contact Information
          </h3>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="font-semibold text-gray-800">
                {patient.email || "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>

              <p className="font-semibold text-gray-800">
                {patient.phone || "Not specified"}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-sm text-gray-500">
                Address
              </p>

              <p className="font-semibold text-gray-800">
                {patient.address || "Not specified"}
              </p>
            </div>

          </div>
        </div>

        {/* Emergency Contact */}
        <div className="border-t pt-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Emergency Contact
          </h3>

          <div className="grid grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-gray-500">
                Contact Name
              </p>

              <p className="font-semibold text-gray-800">
                {patient.emergencyContactName ||
                  "Not specified"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Contact Phone
              </p>

              <p className="font-semibold text-gray-800">
                {patient.emergencyContactPhone ||
                  "Not specified"}
              </p>
            </div>

          </div>
        </div>

        {/* Medical Information */}
        <div className="border-t pt-5">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Medical Information
          </h3>

          <div>
            <p className="text-sm text-gray-500">
              Medical Notes
            </p>

            <div className="mt-2 rounded-lg bg-gray-50 p-4 text-gray-700">
              {patient.medicalCondition ||
                "No medical notes available."}
            </div>
          </div>
        </div>

        {/* Close */}
        <div className="flex justify-end border-t pt-5">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

      </div>
    </Modal>
  );
}
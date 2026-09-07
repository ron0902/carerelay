import { useEffect, useState } from "react";
import { Button, Modal } from "../../components/ui";
import { type Patient } from "../../types/patient";
import { updatePatient } from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

interface ViewPatientModalProps {
  open: boolean;
  patient: Patient | null;
  onClose: () => void;
  onVisibilityChange?: (patientId: number, isPublic: boolean) => void;
}

export default function ViewPatientModal({
  open,
  patient,
  onClose,
  onVisibilityChange,
}: ViewPatientModalProps) {
  const { user } = useAuth();
  const [notesPublic, setNotesPublic] = useState(false);
  const [savingVisibility, setSavingVisibility] = useState(false);

  const canManageVisibility =
    ["Admin", "System Admin", "Organization"].includes(user?.role ?? "");

  useEffect(() => {
    if (patient) {
      setNotesPublic(Boolean(patient.medicalNotesPublic));
    }
  }, [patient]);

  if (!patient) return null;

  const handleToggleVisibility = async () => {
    const nextValue = !notesPublic;
    setNotesPublic(nextValue);
    setSavingVisibility(true);

    try {
      const response = await updatePatient({
        actor_user_id: user?.id,
        id: patient.id,
        first_name: patient.name.split(/\s+/)[0] ?? "",
        last_name: patient.name.split(/\s+/).slice(1).join(" ") ?? "",
        email: patient.email,
        phone: patient.phone,
        status: patient.status,
        date_of_birth: patient.dateOfBirth,
        gender: patient.gender,
        blood_type: patient.bloodType,
        address: patient.address,
        emergency_contact_name: patient.emergencyContactName,
        emergency_contact_phone: patient.emergencyContactPhone,
        medical_notes: patient.medicalCondition,
        medical_notes_public: nextValue ? 1 : 0,
      });

      if (!response.success) {
        setNotesPublic(!nextValue);
        alert(response.message || "Unable to update note visibility.");
        return;
      }

      if (onVisibilityChange) {
        onVisibilityChange(patient.id, nextValue);
      }
    } catch (error) {
      console.error("Failed to toggle patient note visibility:", error);
      setNotesPublic(!nextValue);
      alert("Unable to update note visibility.");
    } finally {
      setSavingVisibility(false);
    }
  };

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

          {canManageVisibility && (
            <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Notes visibility
                </p>
                <p className="text-sm text-gray-700">
                  {notesPublic ? "Visible to everyone" : "Hidden from others"}
                </p>
              </div>

              <Button
                variant={notesPublic ? "secondary" : "primary"}
                onClick={handleToggleVisibility}
                disabled={savingVisibility}
              >
                {savingVisibility
                  ? "Saving..."
                  : notesPublic
                    ? "Hide from everyone"
                    : "Show to everyone"}
              </Button>
            </div>
          )}

          <div>
            <p className="text-sm text-gray-500">
              Medical Notes
            </p>

            <div className="mt-2 rounded-lg bg-gray-50 p-4 text-gray-700">
              {canManageVisibility || notesPublic
                ? patient.medicalCondition || "No medical notes available."
                : "Medical notes are currently hidden from other caregivers and patients."}
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
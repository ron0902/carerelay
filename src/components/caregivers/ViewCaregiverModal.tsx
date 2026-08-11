import { Button, Modal } from "../../components/ui";
import { type Caregiver } from "../../types/caregiver";

interface ViewCaregiverModalProps {
  open: boolean;
  caregiver: Caregiver | null;
  onClose: () => void;
}

export default function ViewCaregiverModal({
  open,
  caregiver,
  onClose,
}: ViewCaregiverModalProps) {
  if (!caregiver) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Caregiver Information"
    >
      <div className="space-y-6">

        {/* Account Information */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">
            Account Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Full Name
              </p>
              <p className="font-semibold">
                {caregiver.name || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>
              <p className="font-semibold">
                {caregiver.email || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone
              </p>
              <p className="font-semibold">
                {caregiver.phone || "N/A"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                  caregiver.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {caregiver.status}
              </span>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">
            Professional Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                License Number
              </p>

              <p className="font-semibold">
                {caregiver.licenseNumber || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Experience
              </p>

              <p className="font-semibold">
                {caregiver.experience} years
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Availability
              </p>

              <p className="font-semibold">
                {caregiver.availability}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Hourly Rate
              </p>

              <p className="font-semibold">
                {caregiver.hourlyRate
                  ? `₱${caregiver.hourlyRate.toLocaleString()}`
                  : "Not provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Bio */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">
            About Caregiver
          </h3>

          <p className="text-gray-700">
            {caregiver.bio || "No bio provided."}
          </p>
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

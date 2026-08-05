import { Button, Modal } from "../../components/ui";
import { type Organization } from "../../types/organization";

interface ViewOrganizationModalProps {
  open: boolean;
  organization: Organization | null;
  onClose: () => void;
}

export default function ViewOrganizationModal({
  open,
  organization,
  onClose,
}: ViewOrganizationModalProps) {
  if (!organization) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Organization Details"
    >
      <div className="space-y-6">

        <div>
          <h3 className="mb-3 border-b pb-2 text-lg font-semibold">
            Organization Information
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">
                Organization Name
              </p>
              <p className="font-semibold">
                {organization.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Organization Type
              </p>
              <p className="font-semibold">
                {organization.type}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Status
              </p>

              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                  organization.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {organization.status}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 border-b pb-2 text-lg font-semibold">
            Contact Information
          </h3>

          <div className="space-y-3">

            <div>
              <p className="text-sm text-gray-500">
                Contact Person
              </p>
              <p className="font-semibold">
                {organization.contactPerson}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone Number
              </p>
              <p className="font-semibold">
                {organization.phone}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email Address
              </p>
              <p className="font-semibold">
                {organization.email}
              </p>
            </div>

          </div>
        </div>

        <div>
          <h3 className="mb-3 border-b pb-2 text-lg font-semibold">
            Address
          </h3>

          <p>{organization.address}</p>
        </div>

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
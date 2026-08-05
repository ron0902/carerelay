import { Button, Modal } from "../../components/ui";
import { type Organization } from "../../types/organization";

interface DeleteOrganizationModalProps {
  open: boolean;
  organization: Organization | null;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteOrganizationModal({
  open,
  organization,
  onClose,
  onConfirm,
}: DeleteOrganizationModalProps) {
  if (!organization) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Delete Organization"
    >
      <div className="space-y-6">

        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-red-700 font-medium">
            Are you sure you want to delete this organization?
          </p>

          <p className="mt-2 text-sm text-gray-600">
            This action cannot be undone.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border p-4">

          <div>
            <p className="text-sm text-gray-500">
              Organization
            </p>

            <p className="font-semibold">
              {organization.name}
            </p>
          </div>

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
              Status
            </p>

            <p className="font-semibold">
              {organization.status}
            </p>
          </div>

        </div>

        <div className="flex justify-end gap-3 border-t pt-5">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
          >
            Delete Organization
          </Button>

        </div>

      </div>
    </Modal>
  );
}
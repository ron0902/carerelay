import { useEffect, useState } from "react";
import { Button, Input, Modal } from "../../components/ui";
import { type Organization } from "../../types/organization";

interface AddOrganizationModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (organization: Organization) => void;
  organization?: Organization | null;
}

export default function AddOrganizationModal({
  open,
  onClose,
  onSave,
  organization,
}: AddOrganizationModalProps) {
  const [form, setForm] = useState({
    name: "",
    type: "",
    contactPerson: "",
    phone: "",
    email: "",
    address: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({
    name: "",
    type: "",
    contactPerson: "",
  });

  useEffect(() => {
    if (organization) {
      setForm({
        name: organization.name,
        type: organization.type,
        contactPerson: organization.contactPerson,
        phone: organization.phone,
        email: organization.email,
        address: organization.address,
        status: organization.status,
      });
    } else {
      setForm({
        name: "",
        type: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        status: "Active",
      });
    }

    setErrors({
      name: "",
      type: "",
      contactPerson: "",
    });
  }, [organization, open]);

  const handleSave = () => {
    const newErrors = {
      name: "",
      type: "",
      contactPerson: "",
    };

    let hasError = false;

    if (!form.name.trim()) {
      newErrors.name = "Organization name is required.";
      hasError = true;
    }

    if (!form.type.trim()) {
      newErrors.type = "Organization type is required.";
      hasError = true;
    }

    if (!form.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const newOrganization: Organization = {
      id: organization?.id ?? Date.now(),
      name: form.name,
      type: form.type,
      contactPerson: form.contactPerson,
      phone: form.phone,
      email: form.email,
      address: form.address,
      status: form.status as "Active" | "Inactive",
    };

    onSave(newOrganization);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        organization
          ? "Edit Organization"
          : "Register New Organization"
      }
    >
      <div className="space-y-6">

        {/* Organization Information */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">
            Organization Information
          </h3>

          <div className="space-y-4">

            <Input
              label="Organization Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name}
              </p>
            )}

            <Input
              label="Organization Type"
              placeholder="Hospital, Clinic..."
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
            />

            {errors.type && (
              <p className="text-sm text-red-500">
                {errors.type}
              </p>
            )}

          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">
            Contact Information
          </h3>

          <div className="space-y-4">

            <Input
              label="Contact Person"
              value={form.contactPerson}
              onChange={(e) =>
                setForm({
                  ...form,
                  contactPerson: e.target.value,
                })
              }
            />

            {errors.contactPerson && (
              <p className="text-sm text-red-500">
                {errors.contactPerson}
              </p>
            )}

            <Input
              label="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone: e.target.value,
                })
              }
            />

            <Input
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />

          </div>
        </div>

        {/* Address */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">
            Location
          </h3>

          <Input
            label="Complete Address"
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address: e.target.value,
              })
            }
          />
        </div>

        {/* Status */}
        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {organization
              ? "Update Organization"
              : "Register Organization"}
          </Button>

        </div>

      </div>
    </Modal>
  );
}
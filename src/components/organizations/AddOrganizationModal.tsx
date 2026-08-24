import { useEffect, useState } from "react";
import { Button, Input, Modal } from "../../components/ui";
import { type Organization } from "../../types/organization";

import {
  createOrganization,
  updateOrganization,
} from "../../services/organizationService";

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
        name: organization.name ?? "",
        type: organization.type ?? "",
        contactPerson: organization.contactPerson ?? "",
        phone: organization.phone ?? "",
        email: organization.email ?? "",
        address: organization.address ?? "",
        status: organization.status ?? "Active",
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

  const handleSave = async () => {
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

    // =========================
    // DATABASE PAYLOAD
    // =========================

    const payload = {
      id: organization?.id,

      organization_name: form.name.trim(),
      contact_person: form.contactPerson.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),

      // These are in your database
      city: "",
      province: "",
      postal_code: "",

      description: form.type.trim(),
      website: "",

      status: form.status,
    };

    try {
      let response;

      // =========================
      // UPDATE
      // =========================

      if (organization) {
        response = await updateOrganization(payload);
      }

      // =========================
      // CREATE
      // =========================

      else {
        response = await createOrganization(payload);
      }

      console.log("ORGANIZATION RESPONSE:", response);

      if (!response.success) {
        alert(
          response.message ||
            (organization
              ? "Failed to update organization."
              : "Failed to create organization.")
        );

        return;
      }

      if (!organization && response.temporary_password) {
        alert(
          `Organization account created.\n\nLogin email: ${form.email.trim()}\nTemporary password: ${response.temporary_password}`
        );
      }

      // =========================
      // FRONTEND OBJECT
      // =========================

      const savedOrganization: Organization = {
        id: organization?.id ?? response.organization?.id ?? Date.now(),

        name: form.name.trim(),

        type: form.type.trim(),

        contactPerson: form.contactPerson.trim(),

        phone: form.phone.trim(),

        email: form.email.trim(),

        address: form.address.trim(),

        status: form.status as "Active" | "Inactive",
      };

      onSave(savedOrganization);

      // Reset form
      setForm({
        name: "",
        type: "",
        contactPerson: "",
        phone: "",
        email: "",
        address: "",
        status: "Active",
      });

      setErrors({
        name: "",
        type: "",
        contactPerson: "",
      });

      onClose();
    } catch (error: any) {
      console.error("========== ORGANIZATION ERROR ==========");

      console.error("Full error:", error);
      console.error("Status:", error?.response?.status);
      console.error("Response:", error?.response?.data);
      console.error("URL:", error?.config?.url);
      console.error("Method:", error?.config?.method);

      alert(
        error?.response?.data?.message ||
          `Server error: ${error?.response?.status || "No response"}`
      );
    }
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
              placeholder="Enter organization name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
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
                setForm({
                  ...form,
                  type: e.target.value,
                })
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
              placeholder="Enter contact person"
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
              placeholder="09XXXXXXXXX"
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
              placeholder="example@email.com"
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
            placeholder="Enter complete address"
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
            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        {/* Buttons */}
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
import { useEffect, useState } from "react";
import { Button, Input, Modal } from "../../components/ui";
import { type Caregiver } from "../../types/caregiver";
import {
  createCaregiver,
  updateCaregiver,
} from "../../services/caregiverService";

interface AddCaregiverModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (caregiver: Caregiver) => void | Promise<void>;
  caregiver?: Caregiver | null;
}

export default function AddCaregiverModal({
  open,
  onClose,
  onSave,
  caregiver,
}: AddCaregiverModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",

    licenseNumber: "",
    experience: "",
    availability: "Available",
    hourlyRate: "",
    bio: "",

    status: "Active",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (caregiver) {
      setForm({
        name: caregiver.name ?? "",
        phone: caregiver.phone ?? "",
        email: caregiver.email ?? "",

        licenseNumber: caregiver.licenseNumber ?? "",
        experience: caregiver.experience?.toString() ?? "",
        availability: caregiver.availability ?? "Available",
        hourlyRate: caregiver.hourlyRate?.toString() ?? "",
        bio: caregiver.bio ?? "",

        status: caregiver.status ?? "Active",
      });
    } else {
      setForm({
        name: "",
        phone: "",
        email: "",

        licenseNumber: "",
        experience: "",
        availability: "Available",
        hourlyRate: "",
        bio: "",

        status: "Active",
      });
    }

    setErrors({
      name: "",
      email: "",
      phone: "",
    });
  }, [caregiver, open]);

  const handleSave = async () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
    };

    let hasError = false;

    if (!form.name.trim()) {
      newErrors.name = "Full Name is required.";
      hasError = true;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required.";
      hasError = true;
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // Split full name
    const nameParts = form.name.trim().split(/\s+/);

    const first_name = nameParts.shift() || "";
    const last_name = nameParts.join(" ");

    const payload = {
      id: caregiver?.id,

      first_name,
      last_name,

      email: form.email.trim(),
      phone: form.phone.trim(),

      status: form.status,

      license_number: form.licenseNumber.trim(),

      // specialization intentionally omitted
      experience_years: Number(form.experience) || 0,

      availability: form.availability,

      hourly_rate: Number(form.hourlyRate) || 0,

      bio: form.bio.trim(),
    };

    try {
      let response;

      if (caregiver) {
        response = await updateCaregiver(payload);
      } else {
        response = await createCaregiver(payload);
      }

      console.log("CAREGIVER RESPONSE:", response);

      if (!response.success) {
        alert(
          response.message ||
            "Failed to save caregiver."
        );
        return;
      }

      const savedCaregiver: Caregiver = {
        id: caregiver?.id ?? Date.now(),

        name: form.name.trim(),

        phone: form.phone.trim(),
        email: form.email.trim(),

        licenseNumber: form.licenseNumber.trim(),

        experience:
          Number(form.experience) || 0,

        availability:
          form.availability as
            | "Available"
            | "Busy"
            | "Off Duty",

        hourlyRate:
          Number(form.hourlyRate) || 0,

        bio: form.bio.trim(),

        status:
          form.status as
            | "Active"
            | "Inactive",
      };

      await onSave(savedCaregiver);

      onClose();
    } catch (error) {
      console.error(
        "Failed to save caregiver:",
        error
      );

      alert(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        caregiver
          ? "Edit Caregiver"
          : "Register New Caregiver"
      }
    >
      <div className="space-y-6">

        {/* Account Information */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">
            Account Information
          </h3>

          <Input
            label="Full Name"
            placeholder="Enter caregiver's full name"
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
            label="Phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
          />

          {errors.phone && (
            <p className="text-sm text-red-500">
              {errors.phone}
            </p>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />

          {errors.email && (
            <p className="text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        {/* Professional Information */}
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">
            Professional Information
          </h3>

          <Input
            label="License Number"
            placeholder="Enter license number"
            value={form.licenseNumber}
            onChange={(e) =>
              setForm({
                ...form,
                licenseNumber: e.target.value,
              })
            }
          />

          <Input
            label="Years of Experience"
            type="number"
            min="0"
            placeholder="0"
            value={form.experience}
            onChange={(e) =>
              setForm({
                ...form,
                experience: e.target.value,
              })
            }
          />

          <Input
            label="Hourly Rate"
            type="number"
            min="0"
            placeholder="0"
            value={form.hourlyRate}
            onChange={(e) =>
              setForm({
                ...form,
                hourlyRate: e.target.value,
              })
            }
          />

          <div>
            <label className="mb-2 block font-medium">
              Availability
            </label>

            <select
              className="w-full rounded-lg border p-3"
              value={form.availability}
              onChange={(e) =>
                setForm({
                  ...form,
                  availability: e.target.value,
                })
              }
            >
              <option value="Available">
                Available
              </option>

              <option value="Busy">
                Busy
              </option>

              <option value="Off Duty">
                Off Duty
              </option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Bio
            </label>

            <textarea
              className="w-full rounded-lg border p-3"
              rows={3}
              placeholder="Enter caregiver bio"
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio: e.target.value,
                })
              }
            />
          </div>
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
            {caregiver
              ? "Update Caregiver"
              : "Register Caregiver"}
          </Button>
        </div>

      </div>
    </Modal>
  );
}
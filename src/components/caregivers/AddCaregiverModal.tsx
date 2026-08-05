import { useEffect, useState } from "react";
import { Button, Input, Modal } from "../../components/ui";
import { type Caregiver } from "../../types/caregiver";

interface AddCaregiverModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (caregiver: Caregiver) => void;
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
    age: "",
    gender: "",

    phone: "",
    email: "",
    address: "",

    specialty: "",
    experience: "",
    organization: "",

    availability: "Available",
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
        name: caregiver.name,
        age: caregiver.age?.toString() ?? "",
        gender: caregiver.gender ?? "",

        phone: caregiver.phone ?? "",
        email: caregiver.email ?? "",
        address: caregiver.address ?? "",

        specialty: caregiver.specialty ?? "",
        experience: caregiver.experience?.toString() ?? "",
        organization: caregiver.organization ?? "",

        availability: caregiver.availability ?? "Available",
        status: caregiver.status ?? "Active",
      });
    } else {
      setForm({
        name: "",
        age: "",
        gender: "",

        phone: "",
        email: "",
        address: "",

        specialty: "",
        experience: "",
        organization: "",

        availability: "Available",
        status: "Active",
      });
    }

    setErrors({
      name: "",
      email: "",
      phone: "",
    });
  }, [caregiver, open]);

  const handleSave = () => {
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

    const newCaregiver: Caregiver = {
      id: caregiver?.id ?? Date.now(),
      name: form.name,
      age: Number(form.age),
      gender: form.gender as "Male" | "Female",

      phone: form.phone,
      email: form.email,
      address: form.address,

      specialty: form.specialty,
      experience: Number(form.experience),
      organization: form.organization,

      availability: form.availability as
        | "Available"
        | "Busy"
        | "Off Duty",

      status: form.status as "Active" | "Inactive",
    };

    onSave(newCaregiver);

    setForm({
      name: "",
      age: "",
      gender: "",

      phone: "",
      email: "",
      address: "",

      specialty: "",
      experience: "",
      organization: "",

      availability: "Available",
      status: "Active",
    });

    setErrors({
      name: "",
      email: "",
      phone: "",
    });

    onClose();
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
      <div className="space-y-4">
        <div className="space-y-4">
          <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">
            Personal Information
          </h3>

          <Input
            label="Full Name"
            placeholder="Enter caregiver's name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name}</p>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Age"
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />

            <div>
              <label className="mb-2 block font-medium">
                Gender
              </label>

              <select
                className="w-full rounded-lg border p-3"
                value={form.gender}
                onChange={(e) =>
                  setForm({ ...form, gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="border-b pb-2 pt-4 text-lg font-semibold text-gray-800">
            Contact Information
          </h3>

          <Input
            label="Phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="Enter email address"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}

          <Input
            label="Address"
            placeholder="Enter address"
            value={form.address}
            onChange={(e) =>
              setForm({ ...form, address: e.target.value })
            }
          />
        </div>

        <div className="space-y-4">
          <h3 className="border-b pb-2 pt-4 text-lg font-semibold text-gray-800">
            Professional Information
          </h3>

          <Input
            label="Specialty"
            placeholder="Ex. Elder Care"
            value={form.specialty}
            onChange={(e) =>
              setForm({ ...form, specialty: e.target.value })
            }
          />

          <Input
            label="Years of Experience"
            type="number"
            value={form.experience}
            onChange={(e) =>
              setForm({ ...form, experience: e.target.value })
            }
          />

          <Input
            label="Organization"
            placeholder="CareRelay Healthcare"
            value={form.organization}
            onChange={(e) =>
              setForm({ ...form, organization: e.target.value })
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
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Off Duty">Off Duty</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {caregiver ? "Update Caregiver" : "Register Caregiver"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
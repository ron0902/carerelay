import { useEffect, useState } from "react";
import { Modal, Button, Input } from "../../components/ui";
import { type Patient } from "../../types/patient";

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patient?: Patient | null;
}

export default function AddPatientModal({
  open,
  onClose,
  onSave,
  patient,
}: AddPatientModalProps) {


  
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    status: "Active",

    phone: "",
    email: "",
    address: "",

    bloodType: "",
    medicalCondition: "",

    caregiver: "",
    organization: "",

    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
  });

  useEffect(() => {
    if (patient) {
      setForm({
        name: patient.name,
        age: String(patient.age),
        gender: patient.gender,
        status: patient.status,

        phone: patient.phone ?? "",
        email: patient.email ?? "",
        address: patient.address ?? "",

        bloodType: patient.bloodType ?? "",
        medicalCondition: patient.medicalCondition ?? "",

        caregiver: patient.caregiver ?? "",
        organization: patient.organization ?? "",

        emergencyContactName: patient.emergencyContactName ?? "",
        emergencyContactPhone: patient.emergencyContactPhone ?? "",
      });
    } else {
      setForm({
        name: "",
        age: "",
        gender: "",
        status: "Active",

        phone: "",
        email: "",
        address: "",

        bloodType: "",
        medicalCondition: "",

        caregiver: "",
        organization: "",

        emergencyContactName: "",
        emergencyContactPhone: "",
      });
    }
  }, [patient, open]);

  const handleSave = () => {
    const newErrors = {
      name: "",
      age: "",
      gender: "",
    };

    let hasError = false;

    if (!form.name.trim()) {
      newErrors.name = "Full Name is required.";
      hasError = true;
    }

    if (!form.age) {
      newErrors.age = "Age is required.";
      hasError = true;
    }

    if (!form.gender) {
      newErrors.gender = "Gender is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const newPatient: Patient = {
      id: patient?.id ?? Date.now(),
      name: form.name,
      age: Number(form.age),
      gender: form.gender as "Male" | "Female",
      status: form.status as "Active" | "Inactive",

      phone: form.phone,
      email: form.email,
      address: form.address,

      bloodType: form.bloodType,
      medicalCondition: form.medicalCondition,

      caregiver: form.caregiver,
      organization: form.organization,

      emergencyContactName: form.emergencyContactName,
      emergencyContactPhone: form.emergencyContactPhone,
    };

    onSave(newPatient);

    setForm({
      name: "",
      age: "",
      gender: "",
      status: "Active",

      phone: "",
      email: "",
      address: "",

      bloodType: "",
      medicalCondition: "",

      caregiver: "",
      organization: "",

      emergencyContactName: "",
      emergencyContactPhone: "",
    });

    setErrors({
      name: "",
      age: "",
      gender: "",
    });

    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={patient ? "Edit Patient" : "Register New Patient"}
    >
      <div className="space-y-6">
        <Input
          label="Full Name"
          placeholder="Enter patient's name"
          value={form.name}
          onChange={(e) => {
            setForm({
              ...form,
              name: e.target.value,
            });

            setErrors({
              ...errors,
              name: "",
            });
          }}
        />

        {errors.name && (
          <p className="text-sm text-red-500">
            {errors.name}
          </p>
        )}

        <Input
          label="Age"
          type="number"
          placeholder="Enter age"
          value={form.age}
          onChange={(e) => {
            setForm({
              ...form,
              age: e.target.value,
            });

            setErrors({
              ...errors,
              age: "",
            });
          }}
        />

        {errors.age && (
          <p className="text-sm text-red-500">
            {errors.age}
          </p>
        )}

        <div>
          <label className="mb-2 block font-medium">
            Gender
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.gender}
            onChange={(e) => {
              setForm({
                ...form,
                gender: e.target.value,
              });

              setErrors({
                ...errors,
                gender: "",
              });
            }}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {errors.gender && (
            <p className="mt-1 text-sm text-red-500">
              {errors.gender}
            </p>
          )}
        </div>

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

        <div className="border-t pt-5">
          <h3 className="mb-4 text-lg font-semibold">
            Contact Information
          </h3>

          <div className="space-y-4">
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

        <div className="flex justify-end gap-3 border-t pt-6">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {patient ? "Update Patient" : "Register Patient"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
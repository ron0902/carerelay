import { useEffect, useState } from "react";
import { Modal, Button, Input } from "../../components/ui";
import { type Patient } from "../../types/patient";
import {
  createPatient,
  updatePatient,
} from "../../services/patientService";
import { useAuth } from "../../context/AuthContext";

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
  patient?: Patient | null;
}

interface PatientForm {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  status: string;
  email: string;
  phone: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalNotes: string;
  password: string;
}

export default function AddPatientModal({
  open,
  onClose,
  onSave,
  patient,
}: AddPatientModalProps) {
  const { user } = useAuth();
  const [form, setForm] = useState<PatientForm>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    bloodType: "",
    status: "Active",
    email: "",
    phone: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    medicalNotes: "",
    password: "Patient@123",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    if (patient) {
      const nameParts = patient.name.trim().split(/\s+/);

      setForm({
        firstName: nameParts[0] ?? "",
        lastName: nameParts.slice(1).join(" "),

        dateOfBirth: patient.dateOfBirth ?? "",
        gender: patient.gender ?? "",
        bloodType: patient.bloodType ?? "",

        status: patient.status ?? "Active",

        email: patient.email ?? "",
        phone: patient.phone ?? "",
        address: patient.address ?? "",

        emergencyContactName:
          patient.emergencyContactName ?? "",

        emergencyContactPhone:
          patient.emergencyContactPhone ?? "",

        medicalNotes:
          patient.medicalCondition ?? "",

        // Don't replace the patient's password when editing
        password: "Patient@123",
      });
    } else {
      resetForm();
    }

    setErrors({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
    });
  }, [patient, open]);

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      bloodType: "",
      status: "Active",
      email: "",
      phone: "",
      address: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      medicalNotes: "",
      password: "Patient@123",
    });
  };

  const handleSave = async () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
    };

    let hasError = false;

    if (!form.firstName.trim()) {
      newErrors.firstName = "First name is required.";
      hasError = true;
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
      hasError = true;
    }

    if (!form.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
      hasError = true;
    }

    if (!form.gender) {
      newErrors.gender = "Gender is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    const payload = {
      created_by: user?.id,
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),

      email: form.email.trim(),
      phone: form.phone.trim(),

      status: form.status,

      date_of_birth: form.dateOfBirth,
      gender: form.gender,
      blood_type: form.bloodType,
      address: form.address,

      emergency_contact_name:
        form.emergencyContactName,

      emergency_contact_phone:
        form.emergencyContactPhone,

      medical_notes: form.medicalNotes,

      // Only needed when creating
      password: form.password,
    };

    try {
      let response;

      if (patient) {
        response = await updatePatient({
          id: patient.id,
          ...payload,
        });
      } else {
        response = await createPatient(payload);
      }

      console.log("PATIENT RESPONSE:", response);

      if (!response.success) {
        alert(
          response.message ||
            (patient
              ? "Failed to update patient."
              : "Failed to create patient.")
        );

        return;
      }

      const savedPatient: Patient = {
        id: patient?.id ?? response.patient?.id ?? Date.now(),

        name: `${form.firstName.trim()} ${form.lastName.trim()}`,

        dateOfBirth: form.dateOfBirth,

        age: calculateAge(form.dateOfBirth),

        gender: form.gender as "Male" | "Female",

        status: form.status as "Active" | "Inactive",

        phone: form.phone,

        email: form.email,

        address: form.address,

        bloodType: form.bloodType,

        medicalCondition: form.medicalNotes,

        emergencyContactName:
          form.emergencyContactName,

        emergencyContactPhone:
          form.emergencyContactPhone,
      };

      onSave(savedPatient);

      resetForm();

      setErrors({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
      });

      onClose();

    } catch (error) {
      console.error(
        "Save patient error:",
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
        patient
          ? "Edit Patient"
          : "Register New Patient"
      }
    >
      <div className="space-y-6">

        {/* Basic Information */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">
            Personal Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Input
                label="First Name"
                placeholder="First name"
                value={form.firstName}
                onChange={(e) => {
                  setForm({
                    ...form,
                    firstName: e.target.value,
                  });

                  setErrors({
                    ...errors,
                    firstName: "",
                  });
                }}
              />

              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Last Name"
                placeholder="Last name"
                value={form.lastName}
                onChange={(e) => {
                  setForm({
                    ...form,
                    lastName: e.target.value,
                  });

                  setErrors({
                    ...errors,
                    lastName: "",
                  });
                }}
              />

              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block font-medium">
                Date of Birth
              </label>

              <input
                type="date"
                className="w-full rounded-lg border p-3"
                value={form.dateOfBirth}
                onChange={(e) => {
                  setForm({
                    ...form,
                    dateOfBirth: e.target.value,
                  });

                  setErrors({
                    ...errors,
                    dateOfBirth: "",
                  });
                }}
              />

              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

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
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>
              </select>

              {errors.gender && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.gender}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">

            <Input
              label="Blood Type"
              placeholder="O+, A-, etc."
              value={form.bloodType}
              onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
            />

            <div>
              <label className="mb-2 block font-medium">Status</label>
              <select
                className="w-full rounded-lg border p-3"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">Contact Information</h3>

          <div className="space-y-4">

            <Input
              label="Email Address"
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <Input
              label="Phone Number"
              placeholder="09XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <Input
              label="Complete Address"
              placeholder="Street, City, ZIP"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">Emergency Contact</h3>

          <div className="grid gap-4 md:grid-cols-2">

            <Input
              label="Contact Name"
              placeholder="Full name"
              value={form.emergencyContactName}
              onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
            />

            <Input
              label="Contact Phone"
              placeholder="09XXXXXXXXX"
              value={form.emergencyContactPhone}
              onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
            />
          </div>
        </div>

        {/* Medical Information */}
        <div>
          <h3 className="mb-4 border-b pb-2 text-lg font-semibold">Medical Information</h3>

          <label className="mb-2 block font-medium">Medical Notes</label>

          <textarea
            className="w-full rounded-lg border p-3"
            rows={4}
            value={form.medicalNotes}
            onChange={(e) => setForm({ ...form, medicalNotes: e.target.value })}
          />
        </div>

        {/* Password */}
        {!patient && (
          <div>
            <Input
              label="Temporary Password"
              placeholder="Temporary password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
        )}

        {/* Buttons */}
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

function calculateAge(dob: string) {
  if (!dob) return 0;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

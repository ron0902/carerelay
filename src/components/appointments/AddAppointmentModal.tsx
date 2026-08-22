import { useEffect, useState } from "react";
import { Button, Input, Modal } from "../../components/ui";
import { type Appointment } from "../../types/appointment";

import { getPatients } from "../../services/patientService";
import { getCaregivers } from "../../services/caregiverService";
import { getOrganizations } from "../../services/organizationService";

interface AddAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment?: Appointment | null;
}

interface Option {
  id: number;
  name: string;
}

export default function AddAppointmentModal({
  open,
  onClose,
  onSave,
  appointment,
}: AddAppointmentModalProps) {
  const [patients, setPatients] = useState<Option[]>([]);
  const [caregivers, setCaregivers] = useState<Option[]>([]);
  const [organizations, setOrganizations] = useState<Option[]>([]);

  const [loadingOptions, setLoadingOptions] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    caregiverId: "",
    organizationId: "",
    appointmentDate: "",
    appointmentTime: "",
    duration: "60",
    appointmentType: "Home Visit",
    reason: "",
    location: "",
    status: "Pending" as
      | "Pending"
      | "Approved"
      | "In Progress"
      | "Completed"
      | "Cancelled"
      | "Rejected",
    notes: "",
  });

  const [errors, setErrors] = useState({
    patientId: "",
    caregiverId: "",
    organizationId: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {
    if (!open) return;

    loadOptions();

    if (appointment) {
      setForm({
        patientId: String(appointment.patientId ?? ""),
        caregiverId: String(appointment.caregiverId ?? ""),
        organizationId: String(
          appointment.organizationId ?? ""
        ),

        appointmentDate:
          appointment.appointmentDate ?? "",

        appointmentTime:
          appointment.appointmentTime ?? "",

        duration: String(
          appointment.duration ?? 60
        ),

        appointmentType:
          appointment.appointmentType ?? "Home Visit",

        reason:
          appointment.reason ?? "",

        location:
          appointment.location ?? "",

        status:
          appointment.status ?? "Pending",

        notes:
          appointment.notes ?? "",
      });
    } else {
      setForm({
        patientId: "",
        caregiverId: "",
        organizationId: "",
        appointmentDate: "",
        appointmentTime: "",
        duration: "60",
        appointmentType: "Home Visit",
        reason: "",
        location: "",
        status: "Pending",
        notes: "",
      });
    }

    setErrors({
      patientId: "",
      caregiverId: "",
      organizationId: "",
      appointmentDate: "",
      appointmentTime: "",
    });
  }, [appointment, open]);

  // =====================================
  // LOAD PATIENT / CAREGIVER / ORGANIZATION
  // =====================================

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);

      const [
        patientResponse,
        caregiverResponse,
        organizationResponse,
      ] = await Promise.all([
        getPatients(),
        getCaregivers(),
        getOrganizations(),
      ]);

      if (patientResponse.success) {
        setPatients(
          (patientResponse.patients || []).map(
            (patient: any) => ({
              id: Number(patient.id),
              name:
                `${patient.first_name ?? ""} ${
                  patient.last_name ?? ""
                }`.trim(),
            })
          )
        );
      }

      if (caregiverResponse.success) {
        setCaregivers(
          (caregiverResponse.caregivers || []).map(
            (caregiver: any) => ({
              id: Number(caregiver.id),
              name:
                `${caregiver.first_name ?? ""} ${
                  caregiver.last_name ?? ""
                }`.trim(),
            })
          )
        );
      }

      if (organizationResponse.success) {
        setOrganizations(
          (
            organizationResponse.organizations ||
            []
          ).map((organization: any) => ({
            id: Number(organization.id),
            name:
              organization.organization_name ?? "",
          }))
        );
      }
    } catch (error) {
      console.error(
        "Failed to load appointment options:",
        error
      );
    } finally {
      setLoadingOptions(false);
    }
  };

  // =====================================
  // SAVE
  // =====================================

  const handleSave = () => {
    const newErrors = {
      patientId: "",
      caregiverId: "",
      organizationId: "",
      appointmentDate: "",
      appointmentTime: "",
    };

    let hasError = false;

    if (!form.patientId) {
      newErrors.patientId = "Patient is required.";
      hasError = true;
    }

    if (!form.caregiverId) {
      newErrors.caregiverId = "Caregiver is required.";
      hasError = true;
    }

    if (!form.organizationId) {
      newErrors.organizationId = "Organization is required.";
      hasError = true;
    }

    if (!form.appointmentDate) {
      newErrors.appointmentDate =
        "Appointment date is required.";
      hasError = true;
    }

    if (!form.appointmentTime) {
      newErrors.appointmentTime =
        "Appointment time is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    // Find selected names
    const selectedPatient = patients.find(
      (patient) =>
        patient.id === Number(form.patientId)
    );

    const selectedCaregiver = caregivers.find(
      (caregiver) =>
        caregiver.id === Number(form.caregiverId)
    );

    const selectedOrganization = organizations.find(
      (organization) =>
        organization.id === Number(form.organizationId)
    );

    // Build appointment object
    const savedAppointment: Appointment = {
      id: appointment?.id ??
        Date.now(),

      patientId: Number(form.patientId),

      caregiverId: Number(form.caregiverId),

      organizationId: form.organizationId
        ? Number(form.organizationId)
        : null,

      patientName: selectedPatient?.name ?? "",

      caregiverName: selectedCaregiver?.name ?? "",

      organizationName: selectedOrganization?.name ?? "",

      appointmentDate: form.appointmentDate,

      appointmentTime: form.appointmentTime,

      duration: Number(form.duration),

      appointmentType: form.appointmentType.trim(),
      service: form.appointmentType.trim(),

      reason: form.reason.trim(),

      location: form.location.trim(),

      status: form.status,

      notes: form.notes.trim(),

      createdAt: appointment?.createdAt ?? "",

      updatedAt: appointment?.updatedAt ?? "",
    };

    // IMPORTANT:
    // The parent AppointmentsPage handles the API request.
    // Do NOT call createAppointment() or updateAppointment() here.
    onSave(savedAppointment);
  };

  // =====================================
  // UI
  // =====================================

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        appointment
          ? "Edit Appointment"
          : "New Appointment"
      }
    >
      <div className="space-y-5">

        {/* PATIENT */}

        <div>
          <label className="mb-2 block font-medium">
            Patient
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.patientId}
            disabled={loadingOptions}
            onChange={(e) =>
              setForm({
                ...form,
                patientId: e.target.value,
              })
            }
          >
            <option value="">
              Select Patient
            </option>

            {patients.map((patient) => (
              <option
                key={patient.id}
                value={patient.id}
              >
                {patient.name}
              </option>
            ))}
          </select>

          {errors.patientId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.patientId}
            </p>
          )}
        </div>

        {/* CAREGIVER */}

        <div>
          <label className="mb-2 block font-medium">
            Caregiver
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.caregiverId}
            disabled={loadingOptions}
            onChange={(e) =>
              setForm({
                ...form,
                caregiverId: e.target.value,
              })
            }
          >
            <option value="">
              Select Caregiver
            </option>

            {caregivers.map((caregiver) => (
              <option
                key={caregiver.id}
                value={caregiver.id}
              >
                {caregiver.name}
              </option>
            ))}
          </select>

          {errors.caregiverId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.caregiverId}
            </p>
          )}
        </div>

        {/* ORGANIZATION */}

        <div>
          <label className="mb-2 block font-medium">
            Organization
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.organizationId}
            disabled={loadingOptions}
            onChange={(e) =>
              setForm({
                ...form,
                organizationId:
                  e.target.value,
              })
            }
          >
            <option value="">
              Select Organization
            </option>

            {organizations.map(
              (organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </option>
              )
            )}
          </select>

          {errors.organizationId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.organizationId}
            </p>
          )}
        </div>

        {/* DATE + TIME */}

        <div className="grid grid-cols-2 gap-4">

          <div>
            <Input
              label="Appointment Date"
              type="date"
              value={form.appointmentDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  appointmentDate:
                    e.target.value,
                })
              }
            />

            {errors.appointmentDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.appointmentDate}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Appointment Time"
              type="time"
              value={form.appointmentTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  appointmentTime:
                    e.target.value,
                })
              }
            />

            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.appointmentTime}
              </p>
            )}
          </div>

        </div>

        {/* DURATION */}

        <Input
          label="Duration (minutes)"
          type="number"
          min="1"
          value={form.duration}
          onChange={(e) =>
            setForm({
              ...form,
              duration: e.target.value,
            })
          }
        />

        {/* APPOINTMENT TYPE */}

        <div>
          <label className="mb-2 block font-medium">
            Appointment Type
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.appointmentType}
            onChange={(e) =>
              setForm({
                ...form,
                appointmentType: e.target.value,
              })
            }
          >
            <option value="Home Visit">
              Home Visit
            </option>
            <option value="Clinic Visit">
              Clinic Visit
            </option>
            <option value="Virtual Consultation">
              Virtual Consultation
            </option>
          </select>
        </div>

        {/* REASON */}

        <Input
          label="Reason"
          placeholder="Routine checkup"
          value={form.reason}
          onChange={(e) =>
            setForm({
              ...form,
              reason: e.target.value,
            })
          }
        />

        {/* LOCATION */}

        <Input
          label="Location"
          placeholder="Patient's Home"
          value={form.location}
          onChange={(e) =>
            setForm({
              ...form,
              location: e.target.value,
            })
          }
        />

        {/* STATUS */}

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
                status:
                  e.target.value as
                    | "Pending"
                    | "Approved"
                    | "In Progress"
                    | "Completed"
                    | "Cancelled"
                    | "Rejected",
              })
            }
          >
            <option value="Pending">Pending</option>

            <option value="Approved">Approved</option>

            <option value="In Progress">In Progress</option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>

            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* NOTES */}

        <div>
          <label className="mb-2 block font-medium">
            Notes
          </label>

          <textarea
            rows={4}
            className="w-full rounded-lg border p-3"
            placeholder="Add appointment notes..."
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
          />
        </div>

        {/* BUTTONS */}

        <div className="flex justify-end gap-3 border-t pt-6">

          <Button
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {appointment
              ? "Update Appointment"
              : "Create Appointment"}
          </Button>

        </div>

      </div>
    </Modal>
  );
}
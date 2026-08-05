import { useEffect, useState } from "react";
import { Button, Input, Modal } from "../../components/ui";
import { type Appointment } from "../../types/appointment";

interface AddAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
  appointment?: Appointment | null;
  patients: string[];
  caregivers: string[];
}

export default function AddAppointmentModal({
  open,
  onClose,
  onSave,
  appointment,
  patients,
  caregivers,
}: AddAppointmentModalProps) {
  const [form, setForm] = useState({
    patientName: "",
    caregiverName: "",
    appointmentDate: "",
    appointmentTime: "",
    service: "",
    status: "Scheduled",
    notes: "",
  });

  const [errors, setErrors] = useState({
    patientName: "",
    caregiverName: "",
    appointmentDate: "",
    appointmentTime: "",
  });

  useEffect(() => {
    if (appointment) {
      setForm({
        patientName: appointment.patientName,
        caregiverName: appointment.caregiverName,
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime,
        service: appointment.service,
        status: appointment.status,
        notes: appointment.notes,
      });
    } else {
      setForm({
        patientName: "",
        caregiverName: "",
        appointmentDate: "",
        appointmentTime: "",
        service: "",
        status: "Scheduled",
        notes: "",
      });
    }

    setErrors({
      patientName: "",
      caregiverName: "",
      appointmentDate: "",
      appointmentTime: "",
    });
  }, [appointment, open]);

  const handleSave = () => {
    const newErrors = {
      patientName: "",
      caregiverName: "",
      appointmentDate: "",
      appointmentTime: "",
    };

    let hasError = false;

    if (!form.patientName.trim()) {
      newErrors.patientName = "Patient is required.";
      hasError = true;
    }

    if (!form.caregiverName.trim()) {
      newErrors.caregiverName = "Caregiver is required.";
      hasError = true;
    }

    if (!form.appointmentDate) {
      newErrors.appointmentDate = "Date is required.";
      hasError = true;
    }

    if (!form.appointmentTime) {
      newErrors.appointmentTime = "Time is required.";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) return;

    onSave({
      id: appointment?.id ?? Date.now(),
      patientName: form.patientName,
      caregiverName: form.caregiverName,
      appointmentDate: form.appointmentDate,
      appointmentTime: form.appointmentTime,
      service: form.service,
      status: form.status as Appointment["status"],
      notes: form.notes,
    });

    onClose();
  };

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
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Patient
            </label>

            <select
              className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={form.patientName}
              onChange={(e) =>
                setForm({
                  ...form,
                  patientName: e.target.value,
                })
              }
            >
              <option value="">Select Patient</option>

              {patients.map((patient) => (
                <option key={patient} value={patient}>
                  {patient}
                </option>
              ))}
            </select>
            {errors.patientName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.patientName}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Caregiver
            </label>

            <select
              className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={form.caregiverName}
              onChange={(e) =>
                setForm({
                  ...form,
                  caregiverName: e.target.value,
                })
              }
            >
              <option value="">Select Caregiver</option>

              {caregivers.map((caregiver) => (
                <option key={caregiver} value={caregiver}>
                  {caregiver}
                </option>
              ))}
            </select>
            {errors.caregiverName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.caregiverName}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Appointment Date"
              type="date"
              value={form.appointmentDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  appointmentDate: e.target.value,
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
                  appointmentTime: e.target.value,
                })
              }
            />
            {errors.appointmentTime && (
              <p className="mt-1 text-sm text-red-500">
                {errors.appointmentTime}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Service"
              placeholder="Home Care"
              value={form.service}
              onChange={(e) =>
                setForm({
                  ...form,
                  service: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="mb-2 block font-medium text-slate-700">
              Status
            </label>

            <select
              className="w-full rounded-lg border border-slate-200 bg-white p-3 shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
            >
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700">
              Notes
            </label>
            <span className="text-xs text-slate-500">Optional</span>
          </div>

          <textarea
            rows={4}
            className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Add care instructions, visit details, or follow-up notes..."
            value={form.notes}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value,
              })
            }
          />
          <p className="mt-2 text-xs text-slate-500">
            Include any special instructions or reminders for this appointment.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-4 py-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave}>
            {appointment ? "Update Appointment" : "Create Appointment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
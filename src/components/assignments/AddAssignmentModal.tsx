import { useEffect, useState } from "react";
import { createAssignment } from "../../services/assignmentService";
import { Button, Modal } from "../../components/ui";
import { type CareAssignment } from "../../types/assignment";

import { updateAssignment } from "../../services/assignmentService";

import { getPatients } from "../../services/patientService";
import { getCaregivers } from "../../services/caregiverService";
import { getOrganizations } from "../../services/organizationService";
import { getOrganizationMembers } from "../../services/organizationPortalService";
import { useAuth } from "../../context/AuthContext";

interface AddAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (assignment: CareAssignment) => void;
  assignment?: CareAssignment | null;
}

interface PatientOption {
  id: number;
  name: string;
}

interface CaregiverOption {
  id: number;
  name: string;
}

interface OrganizationOption {
  id: number;
  name: string;
}

export default function AddAssignmentModal({
  open,
  onClose,
  onSave,
  assignment,
}: AddAssignmentModalProps) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [caregivers, setCaregivers] = useState<CaregiverOption[]>([]);
  const [organizations, setOrganizations] = useState<
    OrganizationOption[]
  >([]);

  const [loadingOptions, setLoadingOptions] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    caregiverId: "",
    organizationId: "",
    assignedDate: "",
    startDate: "",
    endDate: "",
    shift: "Day",
    status:
      "Pending" as
        | "Pending"
        | "Active"
        | "Completed"
        | "Cancelled",
    remarks: "",
  });

  const [errors, setErrors] = useState({
    patientId: "",
    caregiverId: "",
    organizationId: "",
    startDate: "",
    endDate: "",
  });

  // =====================================
  // LOAD DROPDOWN DATA
  // =====================================

  useEffect(() => {
    if (!open) return;

    loadOptions();

    if (assignment) {
      setForm({
        patientId: String(
          assignment.patientId ?? ""
        ),

        caregiverId: String(
          assignment.caregiverId ?? ""
        ),

        organizationId: String(
          assignment.organizationId ?? ""
        ),

        assignedDate:
          assignment.assignedDate ||
          new Date()
            .toISOString()
            .split("T")[0],

        startDate:
          assignment.startDate ?? "",

        endDate:
          assignment.endDate ?? "",

        shift:
          assignment.shift ?? "",

        status:
          assignment.status ?? "Pending",

        remarks:
          assignment.remarks ?? "",
      });
    } else {
      const today =
        new Date().toISOString().split("T")[0];

      setForm({
        patientId: "",
        caregiverId: "",
        organizationId: "",
        assignedDate: today,
        startDate: "",
        endDate: "",
        shift: "",
        status: "Pending",
        remarks: "",
      });
    }

    setErrors({
      patientId: "",
      caregiverId: "",
      organizationId: "",
      startDate: "",
      endDate: "",
    });
  }, [assignment, open]);

  // =====================================
  // LOAD PATIENTS / CAREGIVERS / ORGS
  // =====================================

  const loadOptions = async () => {
    try {
      setLoadingOptions(true);

      // Patients
      const [
        patientResponse,
        caregiverResponse,
        organizationResponse,
      ] = await Promise.all([
        getPatients(user?.role === "Organization" ? user.id : undefined),
        getCaregivers(user?.role === "Organization" ? user.id : undefined),
        user?.role === "Organization"
          ? getOrganizationMembers(user.id)
          : getOrganizations(),
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
          (organizationResponse.organizations || (organizationResponse.organization ? [organizationResponse.organization] : [])).map(
            (organization: any) => ({
              id: Number(organization.id),

              name:
                organization.organization_name ??
                "",
            })
          )
        );
      }
    } catch (error) {
      console.error(
        "Failed to load assignment options:",
        error
      );
    } finally {
      setLoadingOptions(false);
    }
  };

  // =====================================
  // SAVE
  // =====================================

  const handleSave = async () => {
    const newErrors = {
      patientId: "",
      caregiverId: "",
      organizationId: "",
      startDate: "",
      endDate: "",
    };

    let hasError = false;

    if (!form.patientId) {
      newErrors.patientId =
        "Patient is required.";
      hasError = true;
    }

    if (!form.caregiverId) {
      newErrors.caregiverId =
        "Caregiver is required.";
      hasError = true;
    }

    if (!form.organizationId) {
      newErrors.organizationId =
        "Organization is required.";
      hasError = true;
    }

    if (!form.startDate) {
      newErrors.startDate =
        "Start date is required.";
      hasError = true;
    }

    if (!form.endDate) {
      newErrors.endDate =
        "End date is required.";
      hasError = true;
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      newErrors.endDate =
        "End date cannot be before start date.";
      hasError = true;
    }

    if (!form.shift) {
      alert("Shift is required.");
      return;
    }

    setErrors(newErrors);

    if (hasError) return;

    // =====================================
    // DATABASE PAYLOAD
    // =====================================

    const payload = {
      id: assignment?.id,

      patient_id: Number(
        form.patientId
      ),

      caregiver_id: Number(
        form.caregiverId
      ),

      organization_id: Number(
        form.organizationId
      ),

      // TODO:
      // Replace with the actual logged-in
      // admin user ID from your auth/session.
      assigned_by: Number(user?.id ?? 1),

      assigned_date:
        form.assignedDate,

      start_date:
        form.startDate,

      end_date:
        form.endDate,

      shift:
        form.shift.trim(),

      status:
        form.status,

      remarks:
        form.remarks.trim(),
    };

    try {
      console.log("EDIT ASSIGNMENT FORM:", form);
      console.log("ASSIGNED DATE:", form.assignedDate);

      let response;

      if (assignment) {
        response =
          await updateAssignment(payload);
      } else {
        response =
          await createAssignment(payload);
      }

      console.log(
        "ASSIGNMENT SAVE RESPONSE:",
        response
      );

      if (!response.success) {
        alert(
          response.message ||
            (assignment
              ? "Failed to update assignment."
              : "Failed to create assignment.")
        );

        return;
      }

      // =====================================
      // FIND DISPLAY NAMES
      // =====================================

      const selectedPatient =
        patients.find(
          (patient) =>
            patient.id ===
            Number(form.patientId)
        );

      const selectedOrganization =
        organizations.find(
          (organization) =>
            organization.id ===
            Number(form.organizationId)
        );

      const selectedCaregiver =
        caregivers.find(
          (caregiver) =>
            caregiver.id ===
            Number(form.caregiverId)
        );

      // =====================================
      // FRONTEND OBJECT
      // =====================================

      const savedAssignment: CareAssignment = {
        id:
          assignment?.id ??
          Number(
            response.assignment?.id ??
              Date.now()
          ),

        patientId:
          Number(form.patientId),

        caregiverId:
          Number(form.caregiverId),

        organizationId:
          Number(form.organizationId),

        assignedBy: 1,

        assignedDate:
          form.assignedDate,

        startDate:
          form.startDate,

        endDate:
          form.endDate,

        shift:
          form.shift,

        status:
          form.status,

        remarks:
          form.remarks,

        patientName:
          selectedPatient?.name ?? "",

        caregiverName:
          selectedCaregiver?.name ?? "",

        organizationName:
          selectedOrganization?.name ?? "",

        assignedByName:
          "",

        createdAt:
          assignment?.createdAt ?? "",

        updatedAt:
          assignment?.updatedAt ?? "",
      };

      onSave(savedAssignment);

      onClose();
    } catch (error) {
      console.error(
        "Assignment save error:",
        error
      );

      alert(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        assignment
          ? "Edit Assignment"
          : "Create Care Assignment"
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
            onChange={(e) => {
              setForm({
                ...form,
                patientId: e.target.value,
              });

              setErrors({
                ...errors,
                patientId: "",
              });
            }}
          >
            <option value="">Select Patient</option>

            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
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
            onChange={(e) => {
              setForm({
                ...form,
                caregiverId: e.target.value,
              });

              setErrors({
                ...errors,
                caregiverId: "",
              });
            }}
          >
            <option value="">Select Caregiver</option>

            {caregivers.map((caregiver) => (
              <option key={caregiver.id} value={caregiver.id}>
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
            onChange={(e) => {
              setForm({
                ...form,
                organizationId: e.target.value,
              });

              setErrors({
                ...errors,
                organizationId: "",
              });
            }}
          >
            <option value="">Select Organization</option>

            {organizations.map((organization) => (
              <option key={organization.id} value={organization.id}>
                {organization.name}
              </option>
            ))}
          </select>

          {errors.organizationId && (
            <p className="mt-1 text-sm text-red-500">
              {errors.organizationId}
            </p>
          )}
        </div>

        {/* DATES */}

        <div className="grid grid-cols-2 gap-4">

          <div>
            <label className="mb-2 block font-medium">
              Start Date
            </label>

            <input
              type="date"
              className="w-full rounded-lg border p-3"
              value={form.startDate}
              onChange={(e) => {
                setForm({
                  ...form,
                  startDate:
                    e.target.value,
                });

                setErrors({
                  ...errors,
                  startDate: "",
                });
              }}
            />

            {errors.startDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">
              End Date
            </label>

            <input
              type="date"
              className="w-full rounded-lg border p-3"
              value={form.endDate}
              onChange={(e) => {
                setForm({
                  ...form,
                  endDate:
                    e.target.value,
                });

                setErrors({
                  ...errors,
                  endDate: "",
                });
              }}
            />

            {errors.endDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.endDate}
              </p>
            )}
          </div>

        </div>

        {/* SHIFT */}

        <div>
          <label className="mb-2 block font-medium">
            Shift
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={form.shift}
            onChange={(e) =>
              setForm({
                ...form,
                shift: e.target.value,
              })
            }
          >
            <option value="">
              Select Shift
            </option>

            <option value="Morning">
              Morning
            </option>

            <option value="Afternoon">
              Afternoon
            </option>

            <option value="Night">
              Night
            </option>
          </select>
        </div>

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
                    | "Active"
                    | "Completed"
                    | "Cancelled",
              })
            }
          >
            <option value="Pending">
              Pending
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {/* REMARKS */}

        <div>
          <label className="mb-2 block font-medium">
            Remarks
          </label>

          <textarea
            rows={4}
            className="w-full rounded-lg border p-3"
            placeholder="Enter assignment remarks..."
            value={form.remarks}
            onChange={(e) =>
              setForm({
                ...form,
                remarks:
                  e.target.value,
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
            {assignment
              ? "Update Assignment"
              : "Create Assignment"}
          </Button>

        </div>

      </div>
    </Modal>
  );
}
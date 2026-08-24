import { useEffect, useState } from "react";
import { Button } from "../../components/ui";

import {
  getPatients,
  deletePatient,
} from "../../services/patientService";

import PatientTable from "../../components/patients/PatientTable";
import ViewPatientModal from "../../components/patients/ViewPatientModal";
import AddPatientModal from "../../components/patients/AddPatientModal";

import type { Patient } from "../../types/patient";
import { useAuth } from "../../context/AuthContext";

export default function PatientsPage() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  // View
  const [viewPatient, setViewPatient] =
    useState<Patient | null>(null);

  const [viewModalOpen, setViewModalOpen] =
    useState(false);

  // Edit
  const [editPatient, setEditPatient] =
    useState<Patient | null>(null);

  const [editModalOpen, setEditModalOpen] =
    useState(false);

  // Create
  const [addPatientModalOpen, setAddPatientModalOpen] =
    useState(false);

  useEffect(() => {
    loadPatients();
  }, [user]);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const response = await getPatients(
        user?.role === "Organization" ? user.id : undefined
      );

      if (!response.success) {
        console.error(response.message);
        return;
      }

      const formattedPatients: Patient[] =
        response.patients.map((patient: any) => {
          let age = 0;

          if (patient.date_of_birth) {
            const birthDate = new Date(
              patient.date_of_birth
            );

            const today = new Date();

            age =
              today.getFullYear() -
              birthDate.getFullYear();

            const monthDifference =
              today.getMonth() -
              birthDate.getMonth();

            if (
              monthDifference < 0 ||
              (monthDifference === 0 &&
                today.getDate() <
                  birthDate.getDate())
            ) {
              age--;
            }
          }

          return {
            id: Number(patient.id),

            userId: Number(patient.user_id),

            name: `${patient.first_name ?? ""} ${
              patient.last_name ?? ""
            }`.trim(),

            age,

            dateOfBirth:
              patient.date_of_birth ?? "",

            gender:
              patient.gender === "Female"
                ? "Female"
                : "Male",

            status:
              patient.status === "Inactive"
                ? "Inactive"
                : "Active",

            phone: patient.phone ?? "",

            email: patient.email ?? "",

            bloodType:
              patient.blood_type ?? "",

            address:
              patient.address ?? "",

            emergencyContactName:
              patient.emergency_contact_name ?? "",

            emergencyContactPhone:
              patient.emergency_contact_phone ?? "",

            medicalCondition:
              patient.medical_notes ?? "",

            createdAt:
              patient.created_at ?? "",

            updatedAt:
              patient.updated_at ?? "",
          };
        });

      setPatients(formattedPatients);
    } catch (error) {
      console.error(
        "Failed to load patients:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VIEW
  // =========================

  const handleView = (patient: Patient) => {
    setViewPatient(patient);
    setViewModalOpen(true);
  };

  // =========================
  // EDIT
  // =========================

  const handleEdit = (patient: Patient) => {
    setEditPatient(patient);
    setEditModalOpen(true);
  };

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    const patient = patients.find(
      (p) => p.id === id
    );

    if (!patient) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${patient.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await deletePatient(id);

      if (!response.success) {
        alert(
          response.message ||
            "Failed to delete patient."
        );

        return;
      }

      setPatients((currentPatients) =>
        currentPatients.filter(
          (p) => p.id !== id
        )
      );

      alert("Patient deleted successfully.");
    } catch (error) {
      console.error(
        "Delete patient error:",
        error
      );

      alert(
        "Unable to connect to server."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold">
          Patients
        </h1>

        <p className="text-gray-500">
          Loading patients...
        </p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="space-y-6 p-6">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Patients
          </h1>

          <p className="text-gray-500">
            Manage all registered patients.
          </p>
        </div>

        <Button
          onClick={() =>
            setAddPatientModalOpen(true)
          }
        >
          + Add Patient
        </Button>

      </div>

      {/* Patient Table */}
      <PatientTable
        patients={patients}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* ========================= */}
      {/* VIEW PATIENT */}
      {/* ========================= */}

      <ViewPatientModal
        open={viewModalOpen}
        patient={viewPatient}
        onClose={() => {
          setViewModalOpen(false);
          setViewPatient(null);
        }}
      />

      {/* ========================= */}
      {/* EDIT PATIENT */}
      {/* ========================= */}

      <AddPatientModal
        open={editModalOpen}
        patient={editPatient}
        onClose={() => {
          setEditModalOpen(false);
          setEditPatient(null);
        }}
        onSave={(updatedPatient) => {
          setPatients((currentPatients) =>
            currentPatients.map((p) =>
              p.id === updatedPatient.id
                ? updatedPatient
                : p
            )
          );

          setEditModalOpen(false);
          setEditPatient(null);
        }}
      />

      {/* ========================= */}
      {/* CREATE PATIENT */}
      {/* ========================= */}

      <AddPatientModal
        open={addPatientModalOpen}
        patient={null}
        onClose={() => {
          setAddPatientModalOpen(false);
        }}
        onSave={(newPatient) => {
          setPatients((currentPatients) => [
            newPatient,
            ...currentPatients,
          ]);

          setAddPatientModalOpen(false);
        }}
      />

    </div>
  );
}
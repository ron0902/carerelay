import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/dashboard/Statcard";
import ViewPatientModal from "../../components/patients/ViewPatientModal";
import { useEffect, useState } from "react";
import DeletePatientModal from "../../components/patients/DeletePatientModal";
import {
  Alert,
  Button,
  Card,
  EmptyState,
} from "../../components/ui";
import {
  Users,
  HeartPulse,
  UserX,
  UserRound,
} from "lucide-react";
import PatientTable from "../../components/patients/PatientTable";
import PatientToolbar from "../../components/patients/PatientToolbar";
import AddPatientModal from "../../components/patients/AddPatientModal";
import { type Patient } from "../../types/patient";

export default function PatientsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: "Maria Santos",
      age: 67,
      gender: "Female",
      status: "Active",
    },
    {
      id: 2,
      name: "Juan Dela Cruz",
      age: 72,
      gender: "Male",
      status: "Active",
    },
    {
      id: 3,
      name: "Anna Reyes",
      age: 58,
      gender: "Female",
      status: "Inactive",
    },
  ]);



  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      patient.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const patientsPerPage = 5;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPatients.length / patientsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const startIndex = (currentPage - 1) * patientsPerPage;
  const paginatedPatients = filteredPatients.slice(
    startIndex,
    startIndex + patientsPerPage
  );

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleDeletePatient = (id: number) => {
    const patient = patients.find((patient) => patient.id === id) ?? null;
    setPatientToDelete(patient);
  };

  const confirmDeletePatient = () => {
    if (!patientToDelete) return;

    setPatients((prevPatients) =>
      prevPatients.filter((patient) => patient.id !== patientToDelete.id)
    );

    setPatientToDelete(null);
    showSuccess("Patient deleted successfully.");
  };

  const closeDeletePatientModal = () => {
    setPatientToDelete(null);
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  const handleSavePatient = (patient: Patient) => {
    if (selectedPatient) {
      setPatients((prevPatients) =>
        prevPatients.map((p) =>
          p.id === selectedPatient.id
            ? { ...patient, id: selectedPatient.id }
            : p
        )
      );

      showSuccess("Patient updated successfully.");
    } else {
      setPatients((prevPatients) => [...prevPatients, patient]);

      showSuccess("Patient added successfully.");
    }

    setSelectedPatient(null);
    setOpenModal(false);
  };

  const [viewPatient, setViewPatient] =
  useState<Patient | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Patients"
          description="Manage patient records and healthcare information."
        />

        <Button onClick={() => setOpenModal(true)}>
          + Add Patient
        </Button>
      </div>

      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      <Card>
        <div className="mb-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Patients"
            value={patients.length}
            subtitle="Registered"
            icon={<Users size={28} />}
          />

          <StatCard
            title="Active"
            value={patients.filter((p) => p.status === "Active").length}
            subtitle="Currently Active"
            icon={<HeartPulse size={28} />}
          />

          <StatCard
            title="Inactive"
            value={patients.filter((p) => p.status === "Inactive").length}
            subtitle="Need Follow-up"
            icon={<UserX size={28} />}
          />

          <StatCard
            title="Female"
            value={patients.filter((p) => p.gender === "Female").length}
            subtitle="Registered"
            icon={<UserRound size={28} />}
          />
        </div>

        <PatientToolbar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />
       {filteredPatients.length === 0 ? (
        <EmptyState
          title="No patients found"
          description="Try changing your search or status filter."
        />
      ) : (
       <PatientTable
          patients={paginatedPatients}
          onView={setViewPatient}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
        />
      )}

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex gap-2">
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            <Button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      <AddPatientModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedPatient(null);
        }}
        onSave={handleSavePatient}
        patient={selectedPatient}
      />

      <DeletePatientModal
        open={Boolean(patientToDelete)}
        patient={patientToDelete}
        onClose={closeDeletePatientModal}
        onConfirm={confirmDeletePatient}
      />

      <ViewPatientModal
        open={Boolean(viewPatient)}
        patient={viewPatient}
        onClose={() => setViewPatient(null)}
      />
    </div>
  );
}
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  EmptyState,
} from "../../components/ui";

import { type Appointment } from "../../types/appointment";
import { type Patient } from "../../types/patient";

import AppointmentToolbar from "../../components/appointments/AppointmentToolbar";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import AddAppointmentModal from "../../components/appointments/AddAppointmentModal";
import ViewAppointmentModal from "../../components/appointments/ViewAppointmentModal";
import DeleteAppointmentModal from "../../components/appointments/DeleteAppointmentModal";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patientName: "Maria Santos",
      caregiverName: "John Reyes",
      appointmentDate: "2026-07-30",
      appointmentTime: "09:00",
      service: "Home Care",
      status: "Scheduled",
      notes: "Routine checkup",
    },
    {
      id: 2,
      patientName: "Juan Dela Cruz",
      caregiverName: "Maria Cruz",
      appointmentDate: "2026-08-01",
      appointmentTime: "13:30",
      service: "Physical Therapy",
      status: "Completed",
      notes: "Session completed",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const appointmentsPerPage = 5;

  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const patients: Patient[] = [
    {
      id: 1,
      name: "Maria Santos",
      age: 78,
      gender: "Female",
      status: "Active",
    },
    {
      id: 2,
      name: "Juan Dela Cruz",
      age: 65,
      gender: "Male",
      status: "Active",
    },
    {
      id: 3,
      name: "Pedro Ramos",
      age: 82,
      gender: "Male",
      status: "Active",
    },
  ];

  const patientOptions = patients.map((patient) => patient.name);

  const caregiverOptions = [
    "John Reyes",
    "Maria Cruz",
    "James Lopez",
  ];

  const [viewAppointment, setViewAppointment] =
    useState<Appointment | null>(null);

  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleSaveAppointment = (
    appointment: Appointment
  ) => {
    if (selectedAppointment) {
      setAppointments((prev) =>
        prev.map((item) =>
          item.id === selectedAppointment.id
            ? {
                ...appointment,
                id: selectedAppointment.id,
              }
            : item
        )
      );

      showSuccess("Appointment updated successfully.");
    } else {
      setAppointments((prev) => [
        ...prev,
        appointment,
      ]);

      showSuccess("Appointment added successfully.");
    }

    setSelectedAppointment(null);
    setOpenModal(false);
  };

  const confirmDeleteAppointment = () => {
    if (!appointmentToDelete) return;

    setAppointments((prev) =>
      prev.filter(
        (item) => item.id !== appointmentToDelete.id
      )
    );

    setAppointmentToDelete(null);

    showSuccess("Appointment deleted successfully.");
  };

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const matchesSearch =
        appointment.patientName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        appointment.caregiverName
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        appointment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const totalPages = Math.ceil(
    filteredAppointments.length / appointmentsPerPage
  );

  const startIndex =
    (currentPage - 1) * appointmentsPerPage;

  const paginatedAppointments =
    filteredAppointments.slice(
      startIndex,
      startIndex + appointmentsPerPage
    );

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Appointments
          </h1>

          <p className="text-gray-500">
            Manage all scheduled appointments.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedAppointment(null);
            setOpenModal(true);
          }}
        >
          + New Appointment
        </Button>

      </div>

      <AppointmentToolbar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      <Card>

        {filteredAppointments.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="Try changing your search or filter."
          />
        ) : (
          <>
            <AppointmentTable
              appointments={paginatedAppointments}
              onView={setViewAppointment}
              onEdit={(appointment) => {
                setSelectedAppointment(appointment);
                setOpenModal(true);
              }}
              onDelete={setAppointmentToDelete}
            />

            <div className="mt-6 flex items-center justify-between">

              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of{" "}
                {Math.max(totalPages, 1)}
              </span>

              <Button
                variant="secondary"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(
                      page + 1,
                      totalPages
                    )
                  )
                }
              >
                Next
              </Button>

            </div>
          </>
        )}

      </Card>

      <AddAppointmentModal
        open={openModal}
        appointment={selectedAppointment}
        onClose={() => {
          setOpenModal(false);
          setSelectedAppointment(null);
        }}
        onSave={handleSaveAppointment}
        patients={patientOptions}
        caregivers={caregiverOptions}
      />

      <ViewAppointmentModal
        open={viewAppointment !== null}
        appointment={viewAppointment}
        onClose={() =>
          setViewAppointment(null)
        }
      />

      <DeleteAppointmentModal
        open={appointmentToDelete !== null}
        appointment={appointmentToDelete}
        onClose={() =>
          setAppointmentToDelete(null)
        }
        onConfirm={confirmDeleteAppointment}
      />

    </div>
  );
}
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  EmptyState,
} from "../../components/ui";

import { type Appointment } from "../../types/appointment";

import AppointmentToolbar from "../../components/appointments/AppointmentToolbar";
import AppointmentTable from "../../components/appointments/AppointmentTable";
import AddAppointmentModal from "../../components/appointments/AddAppointmentModal";
import ViewAppointmentModal from "../../components/appointments/ViewAppointmentModal";
import DeleteAppointmentModal from "../../components/appointments/DeleteAppointmentModal";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../services/appointmentService";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  const appointmentsPerPage = 5;

  const [openModal, setOpenModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [viewAppointment, setViewAppointment] =
    useState<Appointment | null>(null);

  const [appointmentToDelete, setAppointmentToDelete] =
    useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const response = await getAppointments();

      console.log("APPOINTMENTS API:", response);

      if (response.success) {
        const mappedAppointments: Appointment[] = (
          response.appointments || []
        ).map((appointment: any) => ({
          id: Number(appointment.id),

          patientId:
            Number(appointment.patient_id),

          caregiverId:
            Number(appointment.caregiver_id),

          organizationId:
            appointment.organization_id !== null &&
            appointment.organization_id !== undefined &&
            appointment.organization_id !== ""
              ? Number(appointment.organization_id)
              : null,

          patientName:
            appointment.patient_name ?? "",

          caregiverName:
            appointment.caregiver_name ?? "",

          organizationName:
            appointment.organization_name ?? "",

          appointmentDate:
            appointment.appointment_date ?? "",

          appointmentTime:
            appointment.appointment_time ?? "",

          duration:
            Number(appointment.duration ?? 60),

          appointmentType:
            appointment.appointment_type ?? "",

          reason:
            appointment.reason ?? "",

          location:
            appointment.location ?? "",

          service:
            appointment.appointment_type ?? "",

          status:
            appointment.status ?? "Scheduled",

          notes:
            appointment.notes ?? "",

          createdAt:
            appointment.created_at ?? "",

          updatedAt:
            appointment.updated_at ?? "",
        }));

        setAppointments(mappedAppointments);
      } else {
        console.error(
          "Failed to load appointments:",
          response.message
        );
      }
    } catch (error) {
      console.error(
        "Failed to load appointments:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const handleSaveAppointment = async (
    appointment: Appointment
  ) => {
    try {
      let response;

      // =====================================
      // UPDATE
      // =====================================

      if (selectedAppointment) {
        const payload = {
          id: selectedAppointment.id,

          patient_id: appointment.patientId,

          caregiver_id: appointment.caregiverId,

          organization_id:
            appointment.organizationId,

          appointment_date:
            appointment.appointmentDate,

          appointment_time:
            appointment.appointmentTime,

          duration:
            appointment.duration,

          appointment_type:
            appointment.appointmentType,

          reason:
            appointment.reason,

          location:
            appointment.location,

          status:
            appointment.status,

          notes:
            appointment.notes,
        };

        response =
          await updateAppointment(payload);

        console.log(
          "UPDATE APPOINTMENT RESPONSE:",
          response
        );

        if (!response.success) {
          alert(
            response.message ||
              "Failed to update appointment."
          );
          return;
        }

        showSuccess(
          "Appointment updated successfully."
        );
      } else {
        // =====================================
        // CREATE
        // =====================================

        const payload = {
          patient_id:
            appointment.patientId,

          caregiver_id:
            appointment.caregiverId,

          organization_id:
            appointment.organizationId,

          appointment_date:
            appointment.appointmentDate,

          appointment_time:
            appointment.appointmentTime,

          duration:
            appointment.duration,

          appointment_type:
            appointment.appointmentType,

          reason:
            appointment.reason,

          location:
            appointment.location,

          status:
            appointment.status,

          notes:
            appointment.notes,
        };

        response =
          await createAppointment(payload);

        console.log(
          "CREATE APPOINTMENT RESPONSE:",
          response
        );

        if (!response.success) {
          alert(
            response.message ||
              "Failed to create appointment."
          );
          return;
        }

        showSuccess(
          "Appointment added successfully."
        );
      }

      // =====================================
      // RELOAD FROM DATABASE
      // =====================================

      await loadAppointments();

      setSelectedAppointment(null);
      setOpenModal(false);
    } catch (error) {
      console.error(
        "Appointment save error:",
        error
      );

      alert(
        "Unable to connect to the server. Please try again."
      );
    }
  };

  const confirmDeleteAppointment = async () => {
    if (!appointmentToDelete) return;

    try {
      const response = await deleteAppointment(
        appointmentToDelete.id
      );

      console.log(
        "DELETE APPOINTMENT RESPONSE:",
        response
      );

      if (!response.success) {
        alert(
          response.message ||
            "Failed to delete appointment."
        );
        return;
      }

      setAppointments((prev) =>
        prev.filter(
          (item) =>
            item.id !== appointmentToDelete.id
        )
      );

      setAppointmentToDelete(null);

      showSuccess(
        "Appointment deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete appointment error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) => {
      const matchesSearch =
        (appointment.patientName ?? "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (appointment.caregiverName ?? "")
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
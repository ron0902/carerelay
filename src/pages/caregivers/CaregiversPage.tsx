import { useEffect, useState } from "react";
import { Alert, Button, Card, EmptyState } from "../../components/ui";
import { type Caregiver } from "../../types/caregiver";
import {
  getCaregivers,
  deactivateCaregiver,
} from "../../services/caregiverService";

import CaregiverTable from "../../components/caregivers/CaregiverTable";
import AddCaregiverModal from "../../components/caregivers/AddCaregiverModal";
import DeleteCaregiverModal from "../../components/caregivers/DeleteCaregiverModal";
import ViewCaregiverModal from"../../components/caregivers/ViewCaregiverModal";
import CaregiverToolbar from "../../components/caregivers/CaregiverToolbar";
import { useAuth } from "../../context/AuthContext";

export default function CaregiversPage() {
  const { user } = useAuth();
  const [caregivers, setCaregivers] = useState<Caregiver[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [successMessage, setSuccessMessage] = useState("");

  const [viewCaregiver, setViewCaregiver] =
    useState<Caregiver | null>(null);

  const [caregiverToDelete, setCaregiverToDelete] =
    useState<Caregiver | null>(null);

  const [openModal, setOpenModal] = useState(false);

  const [selectedCaregiver, setSelectedCaregiver] =
    useState<Caregiver | null>(null);

  const caregiversPerPage = 5;

  /*
   * Load caregivers from database
   */
  useEffect(() => {
    loadCaregivers();
  }, [user]);

  const loadCaregivers = async () => {
    try {
      setLoading(true);

      const response = await getCaregivers(
        user?.role === "Organization" ? user.id : undefined
      );

      if (!response.success) {
        console.error(response.message);
        return;
      }

      const formattedCaregivers: Caregiver[] =
        response.caregivers.map((caregiver: any) => ({
          id: Number(caregiver.id),

          userId: Number(caregiver.user_id),

          name: `${caregiver.first_name ?? ""} ${caregiver.last_name ?? ""}`.trim(),

          email: caregiver.email ?? "",

          phone: caregiver.phone ?? "",

          status:
            caregiver.status === "Inactive"
              ? "Inactive"
              : "Active",

          licenseNumber:
            caregiver.license_number ?? "",

          experience:
            Number(caregiver.experience_years) || 0,

          availability:
            caregiver.availability ?? "Available",

          hourlyRate:
            Number(caregiver.hourly_rate) || 0,

          bio:
            caregiver.bio ?? "",
        }));

      setCaregivers(formattedCaregivers);

    } catch (error) {
      console.error(
        "Failed to load caregivers:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const filteredCaregivers = caregivers.filter(
    (caregiver) => {
      const matchesSearch =
        caregiver.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        caregiver.email
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        caregiver.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  const totalPages = Math.ceil(
    filteredCaregivers.length /
      caregiversPerPage
  );

  const startIndex =
    (currentPage - 1) * caregiversPerPage;

  const paginatedCaregivers =
    filteredCaregivers.slice(
      startIndex,
      startIndex + caregiversPerPage
    );

  const confirmDeleteCaregiver = async () => {
    if (!caregiverToDelete) return;
    try {
      console.log(
        "Deactivating caregiver ID:",
        caregiverToDelete.id
      );
      const response = await deactivateCaregiver(
        caregiverToDelete.id
      );
      console.log(
        "DEACTIVATE RESPONSE:",
        response
      );
      if (!response.success) {
        console.error(
          "Deactivate failed:",
          response.message
        );
        alert(
          response.message ||
            "Failed to deactivate caregiver."
        );
        return;
      }
      console.log("Reloading caregivers...");
      await loadCaregivers();
      setCaregiverToDelete(null);
      showSuccess(
        "Caregiver deactivated successfully."
      );
    } catch (error: any) {
      console.error(
        "Deactivate caregiver error:",
        error?.response?.data ||
          error?.message ||
          error
      );
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to connect to server."
      );
    }
  };

  /*
   * Save caregiver
   *
   * This will be connected to create.php/update.php
   * when we update AddCaregiverModal.
   */
  const handleSaveCaregiver = async (
    caregiver: Caregiver
  ) => {
    const isEditing = selectedCaregiver !== null;

    setOpenModal(false);
    setSelectedCaregiver(null);

    await loadCaregivers();

    showSuccess(
      isEditing
        ? "Caregiver updated successfully."
        : "Caregiver added successfully."
    );
  };

  const handleEditCaregiver = (
    caregiver: Caregiver
  ) => {
    setSelectedCaregiver(caregiver);
    setOpenModal(true);
  };

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div>
        <h1 className="mb-2 text-3xl font-bold">
          Caregivers
        </h1>

        <p className="text-gray-500">
          Loading caregivers...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Caregivers
          </h1>

          <p className="text-gray-500">
            Manage all registered caregivers.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedCaregiver(null);
            setOpenModal(true);
          }}
        >
          + Add Caregiver
        </Button>
      </div>

      {/* Toolbar */}
      <CaregiverToolbar
        search={search}
        onSearchChange={setSearch}
        status={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Success message */}
      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      {/* Table */}
      <Card>
        {filteredCaregivers.length === 0 ? (
          <EmptyState
            title="No caregivers found"
            description="Try changing your search or status filter."
          />
        ) : (
          <>
            <CaregiverTable
              caregivers={paginatedCaregivers}
              onView={setViewCaregiver}
              onEdit={handleEditCaregiver}
              onDelete={setCaregiverToDelete}
            />

            {/* Pagination */}
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
                  currentPage === totalPages ||
                  totalPages === 0
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

      {/* Add / Edit */}
      <AddCaregiverModal
        open={openModal}
        caregiver={selectedCaregiver}
        onClose={() => {
          setOpenModal(false);
          setSelectedCaregiver(null);
        }}
        onSave={handleSaveCaregiver}
      />

      {/* Delete */}
      <DeleteCaregiverModal
        open={caregiverToDelete !== null}
        caregiver={caregiverToDelete}
        onClose={() =>
          setCaregiverToDelete(null)
        }
        onConfirm={confirmDeleteCaregiver}
      />

      {/* View */}
      <ViewCaregiverModal
        open={viewCaregiver !== null}
        caregiver={viewCaregiver}
        onClose={() =>
          setViewCaregiver(null)
        }
      />
    </div>
  );
}
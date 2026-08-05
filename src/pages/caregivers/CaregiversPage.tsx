import { useEffect, useState } from "react";
import { Alert, Button, Card, EmptyState } from "../../components/ui";
import { type Caregiver } from "../../types/caregiver";
import CaregiverTable from "../../components/caregivers/CaregiverTable";
import AddCaregiverModal from "../../components/caregivers/AddCaregiverModal";
import DeleteCaregiverModal from "../../components/caregivers/DeleteCaregiverModal";
import ViewCaregiverModal from "../../components/caregivers/ViewCaregiverModal";
import CaregiverToolbar from "../../components/caregivers/CaregiverToolbar";

export default function CaregiversPage() {
  const [caregivers, setCaregivers] = useState<Caregiver[]>([
    {
      id: 1,
      name: "John Reyes",
      age: 31,
      gender: "Male",
      phone: "09123456789",
      email: "john@example.com",
      address: "General Santos City",
      specialty: "Elder Care",
      experience: 6,
      organization: "CareRelay",
      availability: "Available",
      status: "Active",
    },{
    id: 2,
    name: "Maria Cruz",
    age: 29,
    gender: "Female",
    phone: "09987654321",
    email: "maria@example.com",
    address: "Koronadal City",
    specialty: "Home Nursing",
    experience: 4,
    organization: "CareRelay Healthcare",
    availability: "Busy",
    status: "Active",
  }
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");
  const caregiversPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const filteredCaregivers = caregivers.filter((caregiver) => {
    const matchesSearch =
      caregiver.name.toLowerCase().includes(search.toLowerCase()) ||
      caregiver.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      caregiver.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(
    filteredCaregivers.length / caregiversPerPage
  );

  const startIndex = (currentPage - 1) * caregiversPerPage;

  const paginatedCaregivers = filteredCaregivers.slice(
    startIndex,
    startIndex + caregiversPerPage
  );

  const [viewCaregiver, setViewCaregiver] =
  useState<Caregiver | null>(null);

  const [caregiverToDelete, setCaregiverToDelete] =
    useState<Caregiver | null>(null);

  const confirmDeleteCaregiver = () => {
    if (!caregiverToDelete) return;

    setCaregivers((prev) =>
      prev.filter(
        (caregiver) => caregiver.id !== caregiverToDelete.id
      )
    );

    setCaregiverToDelete(null);
    showSuccess("Caregiver deleted successfully.");
  };

  const [openModal, setOpenModal] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] =
    useState<Caregiver | null>(null);

  const handleSaveCaregiver = (caregiver: Caregiver) => {
    if (selectedCaregiver) {
      setCaregivers((prev) =>
        prev.map((item) =>
          item.id === selectedCaregiver.id
            ? { ...caregiver, id: selectedCaregiver.id }
            : item
        )
      );

      showSuccess("Caregiver updated successfully.");
    } else {
      setCaregivers((prev) => [...prev, caregiver]);

      showSuccess("Caregiver added successfully.");
    }

    setSelectedCaregiver(null);
    setOpenModal(false);
  };

  const handleEditCaregiver = (caregiver: Caregiver) => {
    setSelectedCaregiver(caregiver);
    setOpenModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
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

      <CaregiverToolbar
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

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="secondary"
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {currentPage} of {Math.max(totalPages, 1)}
              </span>

              <Button
                variant="secondary"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(page + 1, totalPages)
                  )
                }
              >
                Next
              </Button>
            </div>
          </>
        )}
      </Card>

      <AddCaregiverModal
            open={openModal}
            caregiver={selectedCaregiver}
            onClose={() => {
                setOpenModal(false);
                setSelectedCaregiver(null);
            }}
            onSave={handleSaveCaregiver}
            />
            <DeleteCaregiverModal
                open={caregiverToDelete !== null}
                caregiver={caregiverToDelete}
                onClose={() => setCaregiverToDelete(null)}
                onConfirm={confirmDeleteCaregiver}
                />
                <ViewCaregiverModal
                open={viewCaregiver !== null}
                caregiver={viewCaregiver}
                onClose={() => setViewCaregiver(null)}
                />
    </div>
  );
}
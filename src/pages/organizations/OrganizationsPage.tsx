import { useEffect, useState } from "react";
import { Alert, Button, Card, EmptyState } from "../../components/ui";

import { type Organization } from "../../types/organization";

import OrganizationTable from "../../components/organizations/OrganizationTable";
import OrganizationToolbar from "../../components/organizations/OrganizationToolbar";
import AddOrganizationModal from "../../components/organizations/AddOrganizationModal";
import DeleteOrganizationModal from "../../components/organizations/DeleteOrganizationModal";
import ViewOrganizationModal from "../../components/organizations/ViewOrganizationModal";

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([
    {
      id: 1,
      name: "CareRelay Healthcare",
      type: "Hospital",
      contactPerson: "Dr. Maria Santos",
      phone: "09123456789",
      email: "contact@carerelay.com",
      address: "General Santos City",
      status: "Active",
    },
    {
      id: 2,
      name: "Hope Medical Center",
      type: "Clinic",
      contactPerson: "John Reyes",
      phone: "09987654321",
      email: "info@hopeclinic.com",
      address: "Koronadal City",
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const [successMessage, setSuccessMessage] = useState("");

  const [openModal, setOpenModal] = useState(false);

  const [selectedOrganization, setSelectedOrganization] =
    useState<Organization | null>(null);

  const [viewOrganization, setViewOrganization] =
    useState<Organization | null>(null);

  const [organizationToDelete, setOrganizationToDelete] =
    useState<Organization | null>(null);

  const organizationsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const filteredOrganizations = organizations.filter((organization) => {
    const matchesSearch =
      organization.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      organization.contactPerson
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      organization.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrganizations.length / organizationsPerPage)
  );

  const paginatedOrganizations =
    filteredOrganizations.slice(
      (currentPage - 1) * organizationsPerPage,
      currentPage * organizationsPerPage
    );

  const handleSaveOrganization = (
    organization: Organization
  ) => {
    if (selectedOrganization) {
      setOrganizations((prev) =>
        prev.map((item) =>
          item.id === selectedOrganization.id
            ? {
                ...organization,
                id: selectedOrganization.id,
              }
            : item
        )
      );

      showSuccess("Organization updated successfully.");
    } else {
      setOrganizations((prev) => [
        ...prev,
        organization,
      ]);

      showSuccess("Organization added successfully.");
    }

    setSelectedOrganization(null);
    setOpenModal(false);
  };

  const confirmDeleteOrganization = () => {
    if (!organizationToDelete) return;

    setOrganizations((prev) =>
      prev.filter(
        (organization) =>
          organization.id !== organizationToDelete.id
      )
    );

    setOrganizationToDelete(null);

    showSuccess("Organization deleted successfully.");
  };

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Organizations
          </h1>

          <p className="text-gray-500">
            Manage healthcare organizations and facilities.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedOrganization(null);
            setOpenModal(true);
          }}
        >
          + Add Organization
        </Button>

      </div>

      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      <Card>

        <OrganizationToolbar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {filteredOrganizations.length === 0 ? (
          <EmptyState
            title="No organizations found"
            description="Try changing your search or filter."
          />
        ) : (
          <>
            <OrganizationTable
              organizations={paginatedOrganizations}
              onView={setViewOrganization}
              onEdit={(organization) => {
                setSelectedOrganization(organization);
                setOpenModal(true);
              }}
              onDelete={setOrganizationToDelete}
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
                Page {currentPage} of {totalPages}
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

      <AddOrganizationModal
        open={openModal}
        organization={selectedOrganization}
        onClose={() => {
          setOpenModal(false);
          setSelectedOrganization(null);
        }}
        onSave={handleSaveOrganization}
      />

      <DeleteOrganizationModal
        open={organizationToDelete !== null}
        organization={organizationToDelete}
        onClose={() =>
          setOrganizationToDelete(null)
        }
        onConfirm={confirmDeleteOrganization}
      />

      <ViewOrganizationModal
        open={viewOrganization !== null}
        organization={viewOrganization}
        onClose={() =>
          setViewOrganization(null)
        }
      />

    </div>
  );
}
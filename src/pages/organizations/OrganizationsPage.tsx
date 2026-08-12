import { useEffect, useState } from "react";
import { Alert, Button, Card, EmptyState } from "../../components/ui";

import { type Organization } from "../../types/organization";

import {
  getOrganizations,
  deleteOrganization,
} from "../../services/organizationService";

import OrganizationTable from "../../components/organizations/OrganizationTable";
import OrganizationToolbar from "../../components/organizations/OrganizationToolbar";
import AddOrganizationModal from "../../components/organizations/AddOrganizationModal";
import DeleteOrganizationModal from "../../components/organizations/DeleteOrganizationModal";
import ViewOrganizationModal from "../../components/organizations/ViewOrganizationModal";

export default function OrganizationsPage() {
  // =========================
  // ORGANIZATIONS
  // =========================

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

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

  // =========================
  // LOAD ORGANIZATIONS
  // =========================

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      setLoading(true);

      const response = await getOrganizations();

      console.log("ORGANIZATIONS RESPONSE:", response);

      if (response.success) {
        const mappedOrganizations: Organization[] =
          response.organizations.map((item: any) => ({
            id: Number(item.id),

            name: item.organization_name ?? "",

            type: item.description ?? "",

            contactPerson: item.contact_person ?? "",

            phone: item.phone ?? "",

            email: item.email ?? "",

            address: item.address ?? "",

            status:
              item.status === "Inactive"
                ? "Inactive"
                : "Active",
          }));

        setOrganizations(mappedOrganizations);
      }
    } catch (error) {
      console.error(
        "Failed to load organizations:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SEARCH / FILTER
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  // =========================
  // SUCCESS MESSAGE
  // =========================

  const showSuccess = (message: string) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  // =========================
  // FILTER
  // =========================

  const filteredOrganizations = organizations.filter(
    (organization) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        organization.name
          .toLowerCase()
          .includes(searchText) ||
        organization.contactPerson
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        organization.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredOrganizations.length /
        organizationsPerPage
    )
  );

  const paginatedOrganizations =
    filteredOrganizations.slice(
      (currentPage - 1) * organizationsPerPage,
      currentPage * organizationsPerPage
    );

  // =========================
  // SAVE
  // =========================

  const handleSaveOrganization = (
    organization: Organization
  ) => {
    if (selectedOrganization) {
      // UPDATE FRONTEND LIST
      setOrganizations((prev) =>
        prev.map((item) =>
          item.id === selectedOrganization.id
            ? organization
            : item
        )
      );

      showSuccess(
        "Organization updated successfully."
      );
    } else {
      // ADD TO FRONTEND LIST
      setOrganizations((prev) => [
        organization,
        ...prev,
      ]);

      showSuccess(
        "Organization added successfully."
      );
    }

    setSelectedOrganization(null);
    setOpenModal(false);
  };

  // =========================
  // DELETE
  // =========================

  const confirmDeleteOrganization = async () => {
    if (!organizationToDelete) return;

    try {
      const response =
        await deleteOrganization(
          organizationToDelete.id
        );

      console.log(
        "DELETE ORGANIZATION RESPONSE:",
        response
      );

      if (!response.success) {
        alert(
          response.message ||
            "Failed to delete organization."
        );

        return;
      }

      // Remove from frontend after
      // successful database deletion
      setOrganizations((prev) =>
        prev.filter(
          (organization) =>
            organization.id !==
            organizationToDelete.id
        )
      );

      setOrganizationToDelete(null);

      showSuccess(
        "Organization deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete organization error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Organizations
          </h1>

          <p className="text-gray-500">
            Loading organizations...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Organizations
          </h1>

          <p className="text-gray-500">
            Manage healthcare organizations and
            facilities.
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

      {/* SUCCESS MESSAGE */}
      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}

      {/* TABLE CARD */}
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
            description={
              organizations.length === 0
                ? "There are no organizations registered yet."
                : "Try changing your search or filter."
            }
          />
        ) : (
          <>
            <OrganizationTable
              organizations={
                paginatedOrganizations
              }

              onView={setViewOrganization}

              onEdit={(organization) => {
                setSelectedOrganization(
                  organization
                );

                setOpenModal(true);
              }}

              onDelete={
                setOrganizationToDelete
              }
            />

            {/* PAGINATION */}
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
                {totalPages}
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

      {/* ADD / EDIT */}
      <AddOrganizationModal
        open={openModal}
        organization={selectedOrganization}

        onClose={() => {
          setOpenModal(false);
          setSelectedOrganization(null);
        }}

        onSave={
          handleSaveOrganization
        }
      />

      {/* DELETE */}
      <DeleteOrganizationModal
        open={
          organizationToDelete !== null
        }

        organization={
          organizationToDelete
        }

        onClose={() =>
          setOrganizationToDelete(null)
        }

        onConfirm={
          confirmDeleteOrganization
        }
      />

      {/* VIEW */}
      <ViewOrganizationModal
        open={
          viewOrganization !== null
        }

        organization={
          viewOrganization
        }

        onClose={() =>
          setViewOrganization(null)
        }
      />

    </div>
  );
}
import { useState } from "react";
import { Button, Card, EmptyState } from "../../components/ui";
import { type CareAssignment } from "../../types/assignment";
import AssignmentTable from "../../components/assignments/AssignmentTable";
import AddAssignmentModal from "../../components/assignments/AddAssignmentModal";
import ViewAssignmentModal from "../../components/assignments/ViewAssignmentModal";
import DeleteAssignmentModal from "../../components/assignments/DeleteAssignmentModal";
import AssignmentToolbar from "../../components/assignments/AssignmentToolbar";
export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<CareAssignment[]>([
    {
      id: 1,
      patientName: "Maria Santos",
      caregiverName: "John Reyes",
      organizationName: "Sunrise Care",
      startDate: "2026-07-15",
      endDate: "2026-07-22",
      priority: "High",
      status: "Active",
      notes: "Daily wound care and medication reminders.",
    },
    {
      id: 2,
      patientName: "Juan Dela Cruz",
      caregiverName: "Maria Cruz",
      organizationName: "HealthFirst",
      startDate: "2026-07-10",
      endDate: "2026-07-16",
      priority: "Medium",
      status: "Completed",
      notes: "Post-surgery recovery support completed successfully.",
    },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] =
    useState<CareAssignment | null>(null);
  const [viewAssignment, setViewAssignment] =
    useState<CareAssignment | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] =
    useState<CareAssignment | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const assignmentsPerPage = 5;

  const handleEditAssignment = (
    assignment: CareAssignment
  ) => {
    setSelectedAssignment(assignment);
    setOpenModal(true);
  };

  const handleSaveAssignment = (
    assignment: CareAssignment
  ) => {
    if (selectedAssignment) {
      setAssignments((prev) =>
        prev.map((item) =>
          item.id === selectedAssignment.id
            ? {
                ...assignment,
                id: selectedAssignment.id,
              }
            : item
        )
      );
    } else {
      setAssignments((prev) => [...prev, assignment]);
    }

    setSelectedAssignment(null);
    setOpenModal(false);
  };

  const confirmDeleteAssignment = () => {
    if (!assignmentToDelete) return;

    setAssignments((prev) =>
      prev.filter(
        (assignment) => assignment.id !== assignmentToDelete.id
      )
    );

    setAssignmentToDelete(null);
  };

  const handleStatusChange = (
    id: number,
    status: CareAssignment["status"]
  ) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              status,
            }
          : assignment
      )
    );

    setViewAssignment((prev) =>
      prev
        ? {
            ...prev,
            status,
          }
        : null
    );
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      assignment.patientName.toLowerCase().includes(searchText) ||
      assignment.caregiverName.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      assignment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAssignments.length / assignmentsPerPage)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedAssignments = filteredAssignments.slice(
    (safeCurrentPage - 1) * assignmentsPerPage,
    safeCurrentPage * assignmentsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Care Assignments
          </h1>

          <p className="text-gray-500">
            Assign caregivers to patients and manage care assignments.
          </p>
        </div>

       <Button
        onClick={() => {
          setSelectedAssignment(null);
          setOpenModal(true);
        }}
      >
        + New Assignment
      </Button>
      </div>

      <Card>
        <AssignmentToolbar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {filteredAssignments.length === 0 ? (
          <EmptyState
            title="No assignments found"
            description="Try changing your search or status filter."
          />
        ) : (
          <>
            <AssignmentTable
              assignments={paginatedAssignments}
              onView={setViewAssignment}
              onEdit={handleEditAssignment}
              onDelete={setAssignmentToDelete}
            />

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="secondary"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(page - 1, 1))
                }
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {safeCurrentPage} of {totalPages}
              </span>

              <Button
                variant="secondary"
                disabled={safeCurrentPage === totalPages}
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

        <AddAssignmentModal
        open={openModal}
        assignment={selectedAssignment}
        onClose={() => {
          setOpenModal(false);
          setSelectedAssignment(null);
        }}
        onSave={handleSaveAssignment}
        />

      <ViewAssignmentModal
        open={viewAssignment !== null}
        assignment={viewAssignment}
        onClose={() => setViewAssignment(null)}
        onStatusChange={handleStatusChange}
      />

        <DeleteAssignmentModal
          open={assignmentToDelete !== null}
          assignment={assignmentToDelete}
          onClose={() => setAssignmentToDelete(null)}
          onConfirm={confirmDeleteAssignment}
        />
    </div>
  );
}
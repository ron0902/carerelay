import { useEffect, useState } from "react";
import { Button, Card, EmptyState } from "../../components/ui";

import { type CareAssignment } from "../../types/assignment";

import AssignmentTable from "../../components/assignments/AssignmentTable";
import AddAssignmentModal from "../../components/assignments/AddAssignmentModal";
import ViewAssignmentModal from "../../components/assignments/ViewAssignmentModal";
import DeleteAssignmentModal from "../../components/assignments/DeleteAssignmentModal";
import AssignmentToolbar from "../../components/assignments/AssignmentToolbar";

import {
  getAssignments,
  deleteAssignment,
  updateAssignment,
} from "../../services/assignmentService";
import { useAuth } from "../../context/AuthContext";

export default function AssignmentsPage() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<CareAssignment[]>([]);
  const [loading, setLoading] = useState(true);

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

  // =========================
  // LOAD ASSIGNMENTS
  // =========================

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    try {
      setLoading(true);

      const response = await getAssignments(
        user?.role === "Organization" ? user.id : undefined
      );

      console.log("ASSIGNMENTS RESPONSE:", response);

      if (response.success) {
        const mappedAssignments: CareAssignment[] =
          response.assignments.map((item: any) => ({
            id: Number(item.id),

            patientId: Number(item.patient_id ?? 0),
            caregiverId: Number(item.caregiver_id ?? 0),
            organizationId: Number(item.organization_id ?? 0),
            assignedBy: Number(item.assigned_by ?? 0),

            patientName: item.patient_name ?? "",
            caregiverName: item.caregiver_name ?? "",
            organizationName: item.organization_name ?? "",
            assignedByName: "",

            assignedDate: item.assigned_date ?? "",
            startDate: item.start_date ?? "",
            endDate: item.end_date ?? "",

            shift: item.shift ?? "",
            status: item.status,
            remarks: item.remarks ?? "",

            createdAt: item.created_at ?? "",
            updatedAt: item.updated_at ?? "",

            // Temporary mapping because DB has shift, not priority
            priority: "Medium",

            notes: item.remarks ?? "",
          }));

        setAssignments(mappedAssignments);
      } else {
        console.error("Failed to load assignments:", response.message);
      }
    } catch (error) {
      console.error("Error loading assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================

  const handleEditAssignment = (
    assignment: CareAssignment
  ) => {
    setSelectedAssignment(assignment);
    setOpenModal(true);
  };

  // =========================
  // SAVE
  // =========================

  const handleSaveAssignment = (
    assignment: CareAssignment
  ) => {
    setAssignments((prev) => {
      const exists = prev.some(
        (item) => item.id === assignment.id
      );

      if (exists) {
        return prev.map((item) =>
          item.id === assignment.id
            ? assignment
            : item
        );
      }

      return [assignment, ...prev];
    });

    setSelectedAssignment(null);
    setOpenModal(false);
  };

  // =========================
  // DELETE
  // =========================

  const confirmDeleteAssignment = async () => {
    if (!assignmentToDelete) return;

    try {
      const response = await deleteAssignment(
        assignmentToDelete.id
      );

      console.log(
        "DELETE ASSIGNMENT RESPONSE:",
        response
      );

      if (!response.success) {
        alert(
          response.message ||
            "Failed to delete assignment."
        );
        return;
      }

      setAssignments((prev) =>
        prev.filter(
          (assignment) =>
            assignment.id !== assignmentToDelete.id
        )
      );

      setAssignmentToDelete(null);

      alert("Assignment deleted successfully.");
    } catch (error) {
      console.error(
        "Delete assignment error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // =========================
  // STATUS CHANGE
  // =========================

  const handleStatusChange = async (
    id: number,
    status: CareAssignment["status"]
  ) => {
    try {
      const assignment = assignments.find(
        (item) => item.id === id
      );

      if (!assignment) return;

      const response = await updateAssignment({
        id,
        patient_id: assignment.patientId,
        caregiver_id: assignment.caregiverId,
        organization_id: assignment.organizationId,
        assigned_by: assignment.assignedBy,

        assigned_date: assignment.assignedDate,
        start_date: assignment.startDate,
        end_date: assignment.endDate,

        shift: assignment.shift,
        status,
        remarks: assignment.remarks,
      });

      if (!response.success) {
        alert(
          response.message ||
            "Failed to update assignment status."
        );
        return;
      }

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
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Unable to connect to the server."
      );
    }
  };

  // =========================
  // SEARCH + FILTER
  // =========================

  const filteredAssignments = assignments.filter(
    (assignment) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        assignment.patientName
          .toLowerCase()
          .includes(searchText) ||
        assignment.caregiverName
          .toLowerCase()
          .includes(searchText) ||
        assignment.organizationName
          .toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status === statusFilter;

      return matchesSearch && matchesStatus;
    }
  );

  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredAssignments.length /
        assignmentsPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedAssignments =
    filteredAssignments.slice(
      (safeCurrentPage - 1) *
        assignmentsPerPage,
      safeCurrentPage *
        assignmentsPerPage
    );

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Care Assignments
          </h1>

          <p className="text-gray-500">
            Loading assignments...
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
            Care Assignments
          </h1>

          <p className="text-gray-500">
            Assign caregivers to patients and
            manage care assignments.
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

      {/* TABLE */}

      <Card>

        <AssignmentToolbar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          status={statusFilter}
          onStatusChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
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
                  setCurrentPage((page) =>
                    Math.max(page - 1, 1)
                  )
                }
              >
                Previous
              </Button>

              <span className="text-sm text-gray-600">
                Page {safeCurrentPage} of{" "}
                {totalPages}
              </span>

              <Button
                variant="secondary"
                disabled={
                  safeCurrentPage === totalPages
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

      <AddAssignmentModal
        open={openModal}
        assignment={selectedAssignment}
        onClose={() => {
          setOpenModal(false);
          setSelectedAssignment(null);
        }}
        onSave={handleSaveAssignment}
      />

      {/* VIEW */}

      <ViewAssignmentModal
        open={viewAssignment !== null}
        assignment={viewAssignment}
        onClose={() =>
          setViewAssignment(null)
        }
        onStatusChange={handleStatusChange}
      />

      {/* DELETE */}

      <DeleteAssignmentModal
        open={assignmentToDelete !== null}
        assignment={assignmentToDelete}
        onClose={() =>
          setAssignmentToDelete(null)
        }
        onConfirm={confirmDeleteAssignment}
      />

    </div>
  );
}
import {
  Eye,
  Pencil,
  Trash2,
  User,
  UserCog,
  Building2,
} from "lucide-react";

import { type CareAssignment } from "../../types/assignment";
import { AssignmentStatusBadge } from "./AssignmentStatusBadge";
import AssignmentPriorityBadge from "./AssignmentPriorityBadge";

interface AssignmentTableProps {
  assignments: CareAssignment[];
  onView: (assignment: CareAssignment) => void;
  onEdit: (assignment: CareAssignment) => void;
  onDelete: (assignment: CareAssignment) => void;
}

export default function AssignmentTable({
  assignments,
  onView,
  onEdit,
  onDelete,
}: AssignmentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-gray-50">
            <tr className="border-b">

              <th className="px-6 py-4 text-left">Patient</th>

              <th className="px-6 py-4 text-left">Caregiver</th>

              <th className="px-6 py-4 text-left">Organization</th>

              <th className="px-6 py-4 text-left">Schedule</th>

              <th className="px-6 py-4 text-center">Priority</th>

              <th className="px-6 py-4 text-center">Status</th>

              <th className="px-6 py-4 text-center">Actions</th>

            </tr>
          </thead>

          <tbody>

            {assignments.map((assignment) => (

              <tr
                key={assignment.id}
                className="border-b hover:bg-blue-50 transition"
              >

                {/* Patient */}

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                      <User size={18} />
                    </div>

                    <div>

                      <p className="font-semibold">
                        {assignment.patientName}
                      </p>

                      <p className="text-xs text-gray-500">
                        Patient
                      </p>

                    </div>

                  </div>

                </td>

                {/* Caregiver */}

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="rounded-full bg-green-100 p-3 text-green-700">
                      <UserCog size={18} />
                    </div>

                    <div>

                      <p className="font-semibold">
                        {assignment.caregiverName}
                      </p>

                      <p className="text-xs text-gray-500">
                        Caregiver
                      </p>

                    </div>

                  </div>

                </td>

                {/* Organization */}

                <td className="px-6 py-4">

                  <div className="flex items-center gap-3">

                    <div className="rounded-full bg-purple-100 p-3 text-purple-700">
                      <Building2 size={18} />
                    </div>

                    <div>

                      <p className="font-semibold">
                        {assignment.organizationName}
                      </p>

                    </div>

                  </div>

                </td>

                {/* Schedule */}

                <td className="px-6 py-4">

                  <div>

                    <p className="font-medium">
                      {assignment.startDate}
                    </p>

                    <p className="text-sm text-gray-500">
                      until {assignment.endDate}
                    </p>

                  </div>

                </td>

                {/* Priority */}

                <td className="px-6 py-4 text-center">

                  <AssignmentPriorityBadge
                    priority={assignment.priority}
                  />

                </td>

                {/* Status */}

                <td className="px-6 py-4 text-center">

                  <AssignmentStatusBadge
                    status={assignment.status}
                  />

                </td>

                {/* Actions */}

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => onView(assignment)}
                      className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                    >
                      <Eye size={18}/>
                    </button>

                    <button
                      onClick={() => onEdit(assignment)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      onClick={() => onDelete(assignment)}
                      className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                    >
                      <Trash2 size={18}/>
                    </button>

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>
    </div>
  );
}
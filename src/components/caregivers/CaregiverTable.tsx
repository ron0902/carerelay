import {
  Eye,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import { type Caregiver } from "../../types/caregiver";
import CaregiverStatusBadge from "./CaregiverStatusBadge";
import CaregiverAvailabilityBadge from "./CaregiverAvailabilityBadge";

interface CaregiverTableProps {
  caregivers: Caregiver[];
  onView: (caregiver: Caregiver) => void;
  onEdit: (caregiver: Caregiver) => void;
  onDelete: (caregiver: Caregiver) => void;
}

export default function CaregiverTable({
  caregivers,
  onView,
  onEdit,
  onDelete,
}: CaregiverTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Caregiver
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Contact
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Specialty
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Availability
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {caregivers.map((caregiver) => (
              <tr
                key={caregiver.id}
                className="border-b transition hover:bg-blue-50"
              >
                {/* Caregiver */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <User size={22} />
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {caregiver.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        CG-
                        {String(caregiver.id).padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-6 py-4">
                  <p className="font-medium">
                    {caregiver.phone}
                  </p>

                  <p className="text-sm text-gray-500">
                    {caregiver.email}
                  </p>
                </td>

                {/* Specialty */}
                <td className="px-6 py-4">
                  {caregiver.specialty || "-"}
                </td>

                {/* Availability */}
                <td className="px-6 py-4">
                  <CaregiverAvailabilityBadge
                    availability={caregiver.availability ?? "Off Duty"}
                  />
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <CaregiverStatusBadge status={caregiver.status} />
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView(caregiver)}
                      className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => onEdit(caregiver)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => onDelete(caregiver)}
                      className="rounded-lg bg-red-100 p-2 text-red-600 transition hover:bg-red-200"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
import { Eye, Pencil, Trash2, User } from "lucide-react";
import type { Patient } from "../../types/patient";

interface PatientTableProps {
  patients: Patient[];
  onView: (patient: Patient) => void;
  onEdit: (patient: Patient) => void;
  onDelete: (id: number) => void;
}

export default function PatientTable({
  patients,
  onView,
  onEdit,
  onDelete,
}: PatientTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr className="border-b">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Patient
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Age
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                Gender
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
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b transition hover:bg-blue-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {patient.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        PAT-{String(patient.id).padStart(4, "0")}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {patient.age}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {patient.gender}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {patient.status}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onView(patient)}
                      className="rounded-lg bg-gray-100 p-2 text-gray-600 transition hover:bg-gray-200"
                      title="View"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => onEdit(patient)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(patient.id)}
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

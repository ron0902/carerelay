import {
  Building2,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { type Organization } from "../../types/organization";
import OrganizationStatusBadge from "./OrganizationStatusBadge";

interface OrganizationTableProps {
  organizations: Organization[];
  onView: (organization: Organization) => void;
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

export default function OrganizationTable({
  organizations,
  onView,
  onEdit,
  onDelete,
}: OrganizationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-gray-50">
            <tr className="border-b">

              <th className="px-6 py-4 text-left">
                Organization
              </th>

              <th className="px-6 py-4 text-left">
                Type
              </th>

              <th className="px-6 py-4 text-left">
                Contact
              </th>

              <th className="px-6 py-4 text-left">
                Address
              </th>

              <th className="px-6 py-4 text-left">
                Status
              </th>

              <th className="px-6 py-4 text-center">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {organizations.map((organization) => (

              <tr
                key={organization.id}
                className="border-b hover:bg-blue-50 transition"
              >

                <td className="px-6 py-4">

                  <div className="flex items-center gap-4">

                    <div className="rounded-full bg-blue-100 p-3 text-blue-700">
                      <Building2 size={20}/>
                    </div>

                    <div>

                      <p className="font-semibold">
                        {organization.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        ORG-
                        {String(organization.id).padStart(4,"0")}
                      </p>

                    </div>

                  </div>

                </td>

                <td className="px-6 py-4">
                  {organization.type}
                </td>

                <td className="px-6 py-4">

                  <p className="font-medium">
                    {organization.contactPerson}
                  </p>

                  <p className="text-sm text-gray-500">
                    {organization.phone}
                  </p>

                </td>

                <td className="px-6 py-4">
                  {organization.address}
                </td>

                <td className="px-6 py-4">
                  <OrganizationStatusBadge
                    status={organization.status}
                  />
                </td>

                <td className="px-6 py-4">

                  <div className="flex justify-center gap-2">

                    <button
                      onClick={()=>onView(organization)}
                      className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                    >
                      <Eye size={18}/>
                    </button>

                    <button
                      onClick={()=>onEdit(organization)}
                      className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                    >
                      <Pencil size={18}/>
                    </button>

                    <button
                      onClick={()=>onDelete(organization)}
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
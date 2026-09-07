import { useEffect, useState } from "react";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Alert, Card, EmptyState } from "../../components/ui";
import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { getOrganizationMembers } from "../../services/organizationPortalService";
import ViewOrganizationModal from "../../components/organizations/ViewOrganizationModal";
import type { Organization } from "../../types/organization";

type Member = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  user_role: string;
  member_role: string;
  status: string;
};

export default function OrganizationMembersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [organizationName, setOrganizationName] = useState("Organization");
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getOrganizationMembers(user.id)
      .then((response) => {
        if (!response.success) throw new Error(response.message);
        setMembers(response.members ?? []);
        setOrganizationName(response.organization?.organization_name ?? "Organization");
        if (response.organization) {
          const item = response.organization;
          setOrganization({
            id: Number(item.id),
            organizationCode: item.organization_code ?? `ORG-${String(item.id).padStart(4, "0")}`,
            reference: item.organization_code ?? `ORG-${String(item.id).padStart(4, "0")}`,
            name: item.organization_name ?? "",
            type: item.description?.trim() || "Not specified",
            contactPerson: item.contact_person ?? "",
            phone: item.phone ?? "",
            email: item.email ?? "",
            address: item.address ?? "",
            city: item.city ?? "",
            province: item.province ?? "",
            postalCode: item.postal_code ?? "",
            description: item.description ?? "",
            website: item.website ?? "",
            status: item.status === "Inactive" ? "Inactive" : "Active",
          });
        }
      })
      .catch((requestError) => setError(requestError.message || "Unable to load members."));
  }, [user]);

  return (
    <div className="space-y-8">
      <PageHeader title="Members" description={`${organizationName} members and caregivers`} />
      {organization && (
        <button
          type="button"
          onClick={() => setDetailsOpen(true)}
          className="-mt-4 mb-2 font-medium text-blue-700 hover:text-blue-900 hover:underline"
        >
          {organization.name} ({organization.reference})
        </button>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        {members.length === 0 ? (
          <EmptyState title="No members found" description="Add a caregiver or organization contact to see them here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-medium">Name</th>
                  <th className="px-5 py-4 font-medium">Email</th>
                  <th className="px-5 py-4 font-medium">Phone</th>
                  <th className="px-5 py-4 font-medium">Member type</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-semibold text-gray-900">{member.first_name} {member.last_name}</td>
                    <td className="px-5 py-4 text-gray-600">{member.email}</td>
                    <td className="px-5 py-4 text-gray-600">{member.phone || "Not provided"}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">{member.member_role}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{member.status}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center">
                        {member.member_role === "Caregiver" ? (
                          <button
                            type="button"
                            onClick={() => navigate("/organization/caregivers")}
                            className="flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-200"
                            title="Manage caregiver"
                          >
                            <Settings size={15} />
                            Manage
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <ViewOrganizationModal
        open={detailsOpen}
        organization={organization}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}

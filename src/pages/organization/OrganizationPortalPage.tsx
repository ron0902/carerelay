import { useEffect, useState } from "react";
import { Building2, ClipboardList, UserCog, Users, Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/dashboard/Statcard";
import {
  getOrganizationAssignments,
  getOrganizationCaregivers,
  getOrganizationMembers,
  getOrganizationNotifications,
  getOrganizationPatients,
} from "../../services/organizationPortalService";

export default function OrganizationPortalPage({ section = "dashboard" }: { section?: string }) {
  const { user } = useAuth();
  const [data, setData] = useState({ members: 0, patients: 0, caregivers: 0, assignments: 0, unread: 0, name: "Organization" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getOrganizationMembers(user.id),
      getOrganizationPatients(user.id),
      getOrganizationCaregivers(user.id),
      getOrganizationAssignments(user.id),
      getOrganizationNotifications(user.id),
    ]).then(([members, patients, caregivers, assignments, notifications]) => {
      setData({
        members: members.members?.length ?? 0,
        patients: patients.patients?.length ?? 0,
        caregivers: caregivers.caregivers?.length ?? 0,
        assignments: assignments.assignments?.length ?? 0,
        unread: notifications.unread_count ?? 0,
        name: members.organization?.organization_name ?? "Organization",
      });
    }).catch(() => setError("Unable to load organization data. Please check that the database migration has been applied."));
  }, [user]);

  const title = section === "dashboard" ? "Organization overview" : section[0].toUpperCase() + section.slice(1);
  const cards = section === "dashboard"
    ? [["Members", data.members], ["Patients", data.patients], ["Caregivers", data.caregivers], ["Assignments", data.assignments], ["Unread notifications", data.unread]]
    : section === "members" ? [["Organization members", data.members]]
    : section === "patients" ? [["Patients", data.patients]]
    : section === "caregivers" ? [["Caregivers", data.caregivers]]
    : section === "assignments" ? [["Assignments", data.assignments]]
    : [["Unread notifications", data.unread]];

  const statCards = [
    { title: "Members", value: data.members, subtitle: "Organization members", icon: <Users size={28} />, color: "blue" as const },
    { title: "Patients", value: data.patients, subtitle: "Assigned patients", icon: <Users size={28} />, color: "green" as const },
    { title: "Caregivers", value: data.caregivers, subtitle: "Available caregivers", icon: <UserCog size={28} />, color: "orange" as const },
    { title: "Assignments", value: data.assignments, subtitle: "Care assignments", icon: <ClipboardList size={28} />, color: "purple" as const },
    { title: "Notifications", value: data.unread, subtitle: "Unread notifications", icon: <Bell size={28} />, color: "red" as const },
  ];

  return (
    <div className="space-y-8">
      <PageHeader title={title} description={`${data.name} healthcare management overview`} />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {(section === "dashboard" ? statCards : statCards.filter((card) => cards.some(([label]) => label.toLowerCase().includes(card.title.toLowerCase())))).map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
      {section === "dashboard" && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-700" size={24} />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Organization workspace</h2>
              <p className="mt-1 text-sm text-gray-500">Manage members and coordinate patient care from one place.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

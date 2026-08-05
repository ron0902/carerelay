import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/dashboard/Statcard";
import ActivityCard from "../../components/dashboard/ActivityCard";
import UpcomingVisitCard from "../../components/dashboard/UpcomingVisitCard";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import AssignmentOverview from "../../components/dashboard/AssignmentOverview";
import DashboardGreeting from "../../components/dashboard/DashboardGreeting";
import {
  Users,
  UserCog,
  Building2,
  ClipboardList,
  UserPlus,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    {
      title: "Patients",
      value: 152,
      subtitle: "+12 this month",
      icon: <Users size={28} />,
      color: "blue",
    },
    {
      title: "Caregivers",
      value: 34,
      subtitle: "+2 new",
      icon: <UserCog size={28} />,
      color: "green",
    },
    {
      title: "Assignments",
      value: 48,
      subtitle: "9 Active",
      icon: <ClipboardList size={28} />,
      color: "orange",
    },
    {
      title: "Organizations",
      value: 12,
      subtitle: "+1 this week",
      icon: <Building2 size={28} />,
      color: "purple",
    },
  ];

  return (
    <div className="space-y-8">
              <PageHeader
              title="Dashboard"
              description="Healthcare Management Overview"
            />

        <DashboardGreeting />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color as any}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <AssignmentOverview />

          <ActivityCard
            title="Assignment Created"
            description="Maria Santos assigned to John Reyes"
            time="2 minutes ago"
            type="success"
          />

          <ActivityCard
            title="Caregiver Joined"
            description="Anna Cruz joined CareRelay"
            time="15 minutes ago"
            type="user"
          />

          <ActivityCard
            title="Visit Pending"
            description="Juan Dela Cruz visit starts at 2 PM"
            time="30 minutes ago"
            type="pending"
          />
        </div>

        <div className="space-y-4">
          <UpcomingVisitCard
            patient="Maria Santos"
            caregiver="John Reyes"
            time="Tomorrow • 8:00 AM"
            status="Confirmed"
          />

          <UpcomingVisitCard
            patient="Juan Dela Cruz"
            caregiver="Maria Cruz"
            time="Tomorrow • 1:00 PM"
            status="Confirmed"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuickActionCard
          title="New Patient"
          subtitle="Register patient"
          icon={<UserPlus size={24} />}
        />

        <QuickActionCard
          title="New Assignment"
          subtitle="Assign caregiver"
          icon={<ClipboardList size={24} />}
        />

        <QuickActionCard
          title="Reports"
          subtitle="Generate reports"
          icon={<FileText size={24} />}
        />

        <QuickActionCard
          title="New Caregiver"
          subtitle="Register caregiver"
          icon={<UserCog size={24} />}
        />
      </div>
    </div>
  );
}
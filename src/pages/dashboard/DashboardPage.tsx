import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/dashboard/Statcard";
import ActivityCard from "../../components/dashboard/ActivityCard";
import UpcomingVisitCard from "../../components/dashboard/UpcomingVisitCard";
import QuickActionCard from "../../components/dashboard/QuickActionCard";
import AssignmentOverview from "../../components/dashboard/AssignmentOverview";
import DashboardGreeting from "../../components/dashboard/DashboardGreeting";
import {
  getDashboardStats,
  getUpcomingVisits,
  getRecentActivity,
} from "../../services/dashboardService";
import {
  Users,
  UserCog,
  Building2,
  ClipboardList,
  UserPlus,
  FileText,
} from "lucide-react";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    patients: 0,
    caregivers: 0,
    assignments: 0,
    organizations: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [upcomingVisits, setUpcomingVisits] = useState<any[]>([]);

  const loadDashboardStats = async () => {
    try {
      setLoadingStats(true);
      const response = await getDashboardStats();
      console.log("DASHBOARD STATS API:", response);
      if (response.success) {
        setDashboardStats({
          patients: Number(response.stats?.patients ?? 0),
          caregivers: Number(response.stats?.caregivers ?? 0),
          assignments: Number(response.stats?.assignments ?? 0),
          organizations: Number(response.stats?.organizations ?? 0),
        });
      }
    } catch (error) {
      console.error("Dashboard stats error:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadRecentActivity = async () => {
    try {
      const response = await getRecentActivity();
      console.log("RECENT ACTIVITY API:", response);
      if (response.success) {
        setRecentActivities(response.activities || []);
      } else {
        console.error("Failed to load recent activity:", response.message);
      }
    } catch (error) {
      console.error("Recent activity error:", error);
    }
  };

  const loadUpcomingVisits = async () => {
    try {
      const response = await getUpcomingVisits();
      console.log("UPCOMING VISITS API:", response);
      if (response.success) {
        setUpcomingVisits(response.visits || []);
      }
    } catch (error) {
      console.error("Upcoming visits error:", error);
    }
  };

  useEffect(() => {
    loadDashboardStats();
    loadRecentActivity();
    loadUpcomingVisits();
  }, []);

  type ActivityType = "success" | "user" | "pending";

  const getActivityType = (status: string): ActivityType => {
    switch (status) {
      case "Active":
      case "Completed":
        return "success";
      case "Cancelled":
      case "Suspended":
        return "pending";
      default:
        return "user";
    }
  };

  const stats = [
    {
      title: "Patients",
      value: loadingStats ? "..." : dashboardStats.patients,
      subtitle: "Total patients",
      icon: <Users size={28} />,
      color: "blue",
    },
    {
      title: "Caregivers",
      value: loadingStats ? "..." : dashboardStats.caregivers,
      subtitle: "Total caregivers",
      icon: <UserCog size={28} />,
      color: "green",
    },
    {
      title: "Assignments",
      value: loadingStats ? "..." : dashboardStats.assignments,
      subtitle: "Total assignments",
      icon: <ClipboardList size={28} />,
      color: "orange",
    },
    {
      title: "Organizations",
      value: loadingStats ? "..." : dashboardStats.organizations,
      subtitle: "Total organizations",
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

          {recentActivities.length === 0 ? (
            <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
              No recent activity.
            </div>
          ) : (
            recentActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                title={activity.title}
                description={`${activity.patient_name} assigned to ${activity.caregiver_name}`}
                time={getTimeAgo(activity.created_at)}
                type={getActivityType(activity.status)}
              />
            ))
          )}
        </div>

        <div className="space-y-4">
          {upcomingVisits.length === 0 ? (
            <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
              No upcoming visits.
            </div>
          ) : (
            upcomingVisits.map((visit) => (
              <UpcomingVisitCard
                key={visit.id}
                patient={visit.patient_name}
                caregiver={visit.caregiver_name}
                time={`${visit.appointment_date} • ${visit.appointment_time}`}
                status={visit.status}
              />
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <QuickActionCard
          title="New Patient"
          subtitle="Register patient"
          icon={<UserPlus size={24} />}
          onClick={() => navigate("/patients")}
        />

        <QuickActionCard
          title="New Assignment"
          subtitle="Assign caregiver"
          icon={<ClipboardList size={24} />}
          onClick={() => navigate("/assignments")}
        />

        <QuickActionCard
          title="Reports"
          subtitle="Generate reports"
          icon={<FileText size={24} />}
          onClick={() => navigate("/reports")}
        />

        <QuickActionCard
          title="New Caregiver"
          subtitle="Register caregiver"
          icon={<UserCog size={24} />}
          onClick={() => navigate("/caregivers")}
        />
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} minutes ago`;
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)} hours ago`;
  }
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)} days ago`;
  }
  return then.toLocaleDateString();
}
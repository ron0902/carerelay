import api from "./api";

export interface DashboardStats {
  patients: number;
  caregivers: number;
  assignments: number;
  organizations: number;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: DashboardStats;
  message?: string;
}

export interface UpcomingVisit {
  id: number;
  patient: string;
  caregiver: string;
  date: string;
  time: string;
  status: string;
}

export interface UpcomingVisitsResponse {
  success: boolean;
  visits: UpcomingVisit[];
}

export interface DashboardActivity {
  type: string;
  id: number;
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardActivityResponse {
  success: boolean;
  activities: DashboardActivity[];
}

export interface RecentActivity {
  id: number;
  title: string;
  patient_name: string;
  caregiver_name: string;
  created_at: string;
  status: string;
}

export interface RecentActivityResponse {
  success: boolean;
  activities: RecentActivity[];
  message?: string;
}

export const getDashboardStats =
  async (): Promise<DashboardStatsResponse> => {
    const response = await api.get(
      "/dashboard/getAllStats.php"
    );

    return response.data;
  };

export const getUpcomingVisits =
  async (): Promise<UpcomingVisitsResponse> => {
    const response = await api.get(
      "/dashboard/getUpcomingVisits.php"
    );

    return response.data;
  };

export const getDashboardActivity =
  async (): Promise<DashboardActivityResponse> => {
    const response = await api.get(
      "/dashboard/getDashboardActivity.php"
    );

    return response.data;
  };

export const getRecentActivity =
  async (): Promise<RecentActivityResponse> => {
    const response = await api.get(
      "/dashboard/getRecentActivity.php"
    );

    return response.data;
  };

export const getAssignmentOverview = async () => {
  const response = await api.get(
    "/dashboard/getAssignmentOverview.php"
  );

  return response.data;
};
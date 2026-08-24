import api from "./api";

export const getOrganizationMembers = async (userId: string | number) => {
  const response = await api.get("/organizations/getMembers.php", {
    params: { user_id: userId },
  });
  return response.data;
};

export const getOrganizationPatients = async (userId: string | number) => {
  const response = await api.get("/patients/getAll.php", {
    params: { user_id: userId },
  });
  return response.data;
};

export const getOrganizationCaregivers = async (userId: string | number) => {
  const response = await api.get("/caregivers/getAll.php", {
    params: { user_id: userId },
  });
  return response.data;
};

export const getOrganizationAssignments = async (userId: string | number) => {
  const response = await api.get("/assignments/getAll.php", {
    params: { user_id: userId },
  });
  return response.data;
};

export const getOrganizationNotifications = async (userId: string | number) => {
  const response = await api.post("/notifications/getAll.php", {
    user_id: userId,
  });
  return response.data;
};

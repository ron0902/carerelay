import api from "./api";

export const getPatients = async (userId?: string | number) => {
  const response = await api.get("/patients/getAll.php", {
    ...(userId ? { params: { user_id: userId } } : {}),
  });
  return response.data;
};

export const createPatient = async (payload: any) => {
  const response = await api.post("/patients/create.php", payload);
  return response.data;
};

export const updatePatient = async (payload: any) => {
  const response = await api.put(
    "/patients/update.php",
    payload
  );

  return response.data;
};

export const deletePatient = async (id: number) => {
  const response = await api.delete("/patients/delete.php", {
    data: {
      id,
    },
  });

  return response.data;
};

export const getPatientNotifications = async (userId: string | number) => {
  const response = await api.post("/notifications/getAll.php", {
    user_id: userId,
  });
  return response.data;
};

export const markPatientNotificationRead = async (
  userId: string | number,
  notificationId: string | number
) => {
  const response = await api.put("/notifications/markRead.php", {
    user_id: userId,
    notification_id: notificationId,
  });
  return response.data;
};

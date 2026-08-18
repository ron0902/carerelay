import api from "./api";

export const getCaregivers = async () => {
  const response = await api.get(
    "/caregivers/getAll.php"
  );

  return response.data;
};

export const createCaregiver = async (
  payload: any
) => {
  const response = await api.post(
    "/caregivers/create.php",
    payload
  );

  return response.data;
};

export const updateCaregiver = async (
  payload: any
) => {
  const response = await api.put(
    "/caregivers/update.php",
    payload
  );

  return response.data;
};

export const deleteCaregiver = async (
  id: number
) => {
  const response = await api.delete(
    "/caregivers/delete.php",
    {
      data: { id },
    }
  );

  return response.data;
};

export const deactivateCaregiver = async (
  id: number
) => {
  const response = await api.put(
    "/caregivers/deactivate.php",
    { id }
  );

  return response.data;
};

export const getCaregiverDashboard = async (
  userId: string
) => {
  const response = await api.post(
    "/caregiver/dashboard.php",
    {
      user_id: userId,
    }
  );

  return response.data;
};

export const getTodaysSchedule = async (
  userId: number | string
) => {
  const response = await api.post(
    "/caregiver/todaysSchedule.php",
    {
      user_id: userId,
    }
  );

  return response.data;
};

export const getMyShifts = async (
  userId: string
) => {
  const response = await api.post(
    "/caregiver/getMyShifts.php",
    {
      user_id: userId,
    }
  );

  return response.data;
};

export const getCaregiverAvailability = async (
  userId: string | number
) => {
  const response = await api.post(
    "/caregiver/availability/get.php",
    {
      user_id: userId,
    }
  );

  return response.data;
};

export const saveCaregiverAvailability = async (
  userId: string | number,
  availability: any[]
) => {
  const response = await api.post(
    "/caregiver/availability/save.php",
    {
      user_id: userId,
      availability,
    }
  );

  return response.data;
};

export const getCaregiverProfile = async (
  userId: string | number
) => {
  const response = await api.post(
    "/caregiver/profile/get.php",
    {
      user_id: userId,
    }
  );

  return response.data;
};
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
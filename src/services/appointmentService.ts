import api from "./api";

export const getAppointments = async () => {
  const response = await api.get(
    "/appointments/getAll.php"
  );

  return response.data;
};

export const createAppointment = async (
  payload: any
) => {
  const response = await api.post(
    "/appointments/create.php",
    payload
  );

  return response.data;
};

export const updateAppointment = async (
  payload: any
) => {
  const response = await api.put(
    "/appointments/update.php",
    payload
  );

  return response.data;
};

export const deleteAppointment = async (
  id: number
) => {
  const response = await api.delete(
    "/appointments/delete.php",
    {
      data: { id },
    }
  );

  return response.data;
};
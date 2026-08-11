import api from "./api";

export const getPatients = async () => {
  const response = await api.get("/patients/getAll.php");
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

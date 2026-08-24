import api from "./api";

export const getAssignments = async (userId?: string | number) => {
  const response = await api.get("/assignments/getAll.php", {
    ...(userId ? { params: { user_id: userId } } : {}),
  });
  return response.data;
};

export const createAssignment = async (payload: any) => {
  const response = await api.post(
    "/assignments/create.php",
    payload
  );

  return response.data;
};

export const updateAssignment = async (payload: any) => {
  const response = await api.put(
    "/assignments/update.php",
    payload
  );

  return response.data;
};

export const deleteAssignment = async (id: number) => {
  const response = await api.delete(
    "/assignments/delete.php",
    {
      data: { id },
    }
  );

  return response.data;
};
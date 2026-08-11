import api from "./api";

export const getOrganizations = async () => {
  const response = await api.get("/organizations/getAll.php");
  return response.data;
};

export const createOrganization = async (payload: any) => {
  const response = await api.post(
    "/organizations/create.php",
    payload
  );

  return response.data;
};

export const updateOrganization = async (payload: any) => {
  const response = await api.put(
    "/organizations/update.php",
    payload
  );

  return response.data;
};

export const deleteOrganization = async (id: number) => {
  const response = await api.delete(
    "/organizations/delete.php",
    {
      data: {
        id,
      },
    }
  );

  return response.data;
};
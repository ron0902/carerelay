import api from "./api";

export interface CarePlan {
  id: number;
  patient_id: number;
  caregiver_id: number;
  assignment_id: number | null;
  patient_name: string;
  caregiver_name: string;
  title: string;
  diagnosis: string;
  care_goal: string;
  medications: string;
  instructions: string;
  start_date: string;
  end_date: string | null;
  status: "Active" | "Completed" | "Cancelled";
}

export const getCarePlans = async () => {
  const response = await api.get("/carePlans.php");
  return response.data;
};

export const createCarePlan = async (payload: Omit<CarePlan, "id" | "patient_name" | "caregiver_name">) => {
  const response = await api.post("/carePlans.php", payload);
  return response.data;
};

export const updateCarePlan = async (payload: Omit<CarePlan, "patient_name" | "caregiver_name">) => {
  const response = await api.put("/carePlans.php", payload);
  return response.data;
};

export const deleteCarePlan = async (id: number) => {
  const response = await api.delete("/carePlans.php", { data: { id } });
  return response.data;
};

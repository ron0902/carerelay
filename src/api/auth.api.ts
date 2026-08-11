import api from "../services/api";
import type { LoginRequest, LoginResponse } from "../types/auth";

export const login = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await api.post("/auth/login.php", data);

  return response.data;
};
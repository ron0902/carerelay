import api from "./api";

export const getCaregivers = async (userId?: string | number) => {
  const response = await api.get("/caregivers/getAll.php", {
    ...(userId ? { params: { user_id: userId } } : {}),
  });

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
  userId: string | number
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
  userId: number | string,
  startDate?: string,
  endDate?: string
) => {
  const response = await api.post(
    "/caregiver/todaysSchedule.php",
    {
      user_id: userId,
      ...(startDate ? { start_date: startDate } : {}),
      ...(endDate ? { end_date: endDate } : {}),
    }
  );

  return response.data;
};

export const startCaregiverVisit = async (
  userId: string | number,
  appointmentId: string | number
) => {
  const response = await api.put(
    "/caregiver/startVisit.php",
    {
      user_id: userId,
      appointment_id: appointmentId,
    }
  );

  return response.data;
};

export interface VisitReport {
  checklist: Record<string, boolean>;
  bloodPressure: string;
  temperature: string;
  pulseRate: string;
  painLevel: string;
  mood: string;
  notes: string;
  recommendation: string;
}

export const completeCaregiverVisit = async (
  userId: string | number,
  appointmentId: string | number,
  report: VisitReport
) => {
  const response = await api.put(
    "/caregiver/completeVisit.php",
    { user_id: userId, appointment_id: appointmentId, report }
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

export const getShiftOffers = async (
  userId: string | number
) => {
  const response = await api.post(
    "/caregiver/shiftOffers.php",
    {
      user_id: userId,
    }
  );

  return response.data;
};

export const respondToShiftOffer = async (
  userId: string | number,
  offerId: string | number,
  status: "Accepted" | "Declined"
) => {
  const response = await api.put(
    "/caregiver/respondOffer.php",
    {
      user_id: userId,
      offer_id: offerId,
      status,
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

export const updateCaregiverProfile = async (
  userId: string | number,
  payload: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    license_number: string;
    specialization: string;
    experience_years: number;
    bio: string;
  }
) => {
  const response = await api.put(
    "/caregiver/profile/update.php",
    {
      user_id: userId,
      ...payload,
    }
  );

  return response.data;
};

export const changeCaregiverPassword = async (
  userId: string | number,
  currentPassword: string,
  newPassword: string
) => {
  const response = await api.put(
    "/caregiver/profile/changePassword.php",
    {
      user_id: userId,
      current_password: currentPassword,
      new_password: newPassword,
    }
  );

  return response.data;
};

export const getCaregiverNotifications = async (
  userId: string | number
) => {
  const response = await api.post("/notifications/getAll.php", {
    user_id: userId,
  });

  return response.data;
};

export const getCaregiverCarePlan = async (
  userId: string | number,
  patientId: string | number,
  visitDate?: string
) => {
  const response = await api.post("/caregiver/carePlan.php", {
    user_id: userId,
    patient_id: patientId,
    visit_date: visitDate,
  });

  return response.data;
};

export const markCaregiverNotificationRead = async (
  userId: string | number,
  notificationId: string | number
) => {
  const response = await api.put("/notifications/markRead.php", {
    user_id: userId,
    notification_id: notificationId,
  });

  return response.data;
};
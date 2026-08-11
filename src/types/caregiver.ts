export interface Caregiver {
  id: number;
  userId?: number;

  name: string;

  phone: string;
  email: string;

  licenseNumber: string;
  experience: number;

  availability: "Available" | "Busy" | "Off Duty";

  hourlyRate: number;
  bio: string;

  status: "Active" | "Inactive";

  createdAt?: string;
  updatedAt?: string;
}
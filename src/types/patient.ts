export interface Patient {
  id: number;
  userId: number;

  dateOfBirth: string;
  gender: "Male" | "Female";
  bloodType: string;
  address: string;

  emergencyContactName: string;
  emergencyContactPhone: string;

  medicalCondition: string;

  // Joined from users table
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Inactive";

  // Derived locally (optional)
  age?: number;

  createdAt: string;
  updatedAt: string;
}
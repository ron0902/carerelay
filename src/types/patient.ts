export interface Patient {
  id: number;

  // Basic Information
  name: string;
  age: number;
  gender: "Male" | "Female";
  status: "Active" | "Inactive";

  // Contact Information
  phone?: string;
  email?: string;
  address?: string;

  // Medical Information
  bloodType?: string;
  medicalCondition?: string;
  allergies?: string;

  // Care Information
  caregiver?: string;
  organization?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyRelationship?: string;

  // System Information
  createdAt?: string;
  updatedAt?: string;
}
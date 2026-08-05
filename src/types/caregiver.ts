export interface Caregiver {
  id: number;

  name: string;
  age: number;
  gender: "Male" | "Female";

  phone: string;
  email: string;
  address: string;

  specialty: string;
  experience: number;

  organization: string;

  availability: "Available" | "Busy" | "Off Duty";

  status: "Active" | "Inactive";
}
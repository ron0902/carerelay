export interface Organization {
  id: number;

  name: string;
  type: string;

  contactPerson: string;
  phone: string;
  email: string;

  address: string;

  status: "Active" | "Inactive";
}
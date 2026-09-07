export interface Organization {
  id: number;
  reference?: string;
  organizationCode?: string;

  name: string;
  type: string;

  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  city?: string;
  province?: string;
  postalCode?: string;
  description?: string;
  website?: string;

  status: "Active" | "Inactive";
}
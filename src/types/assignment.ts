export interface CareAssignment {
  id: number;

  patientName: string;
  caregiverName: string;
  organizationName: string;

  startDate: string;
  endDate: string;

  priority: "Low" | "Medium" | "High";

  status:
    | "Pending"
    | "Active"
    | "Completed"
    | "Cancelled";

  notes: string;
}
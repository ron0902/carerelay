export interface CareAssignment {
  id: number;

  patientId: number;
  caregiverId: number;
  organizationId: number;
  assignedBy: number;

  patientName: string;
  caregiverName: string;
  organizationName: string;
  assignedByName: string;

  assignedDate: string;
  startDate: string;
  endDate: string;

  shift: string;

  status:
    | "Pending"
    | "Active"
    | "Completed"
    | "Cancelled";

  remarks: string;

  createdAt: string;
  updatedAt: string;
}
export interface Appointment {
  id: number;

  patientId: number;
  caregiverId: number;
  organizationId: number | null;

  patientName: string;
  caregiverName: string;
  organizationName: string;

  appointmentDate: string;
  appointmentTime: string;

  duration: number;

  appointmentType: string;
  service: string;
  reason: string;
  location: string;

  status:
    | "Scheduled"
    | "Completed"
    | "Cancelled"
    | "No Show";

  notes: string;

  createdAt: string;
  updatedAt: string;
}
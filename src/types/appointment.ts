export interface Appointment {
  id: number;

  patientName: string;

  caregiverName: string;

  appointmentDate: string;

  appointmentTime: string;

  service: string;

  status:
    | "Scheduled"
    | "Completed"
    | "Cancelled";

  notes: string;
}
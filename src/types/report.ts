export interface Report {
  id: number;

  title: string;

  category: string;

  totalRecords: number;

  lastUpdated: string;

  status:
    | "Ready"
    | "Generating"
    | "Archived";
}
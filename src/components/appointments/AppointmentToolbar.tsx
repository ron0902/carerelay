import { Input } from "../ui";

interface AppointmentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  status: string;
  onStatusChange: (value: string) => void;
}

export default function AppointmentToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: AppointmentToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <Input
        placeholder="Search appointments..."
        value={search}
        onChange={(e) =>
          onSearchChange(e.target.value)
        }
      />

      <select
        className="rounded-lg border px-4 py-2"
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value)
        }
      >
        <option>All</option>
        <option>Pending</option>
        <option>Approved</option>
        <option>In Progress</option>
        <option>Completed</option>
        <option>Cancelled</option>
        <option>Rejected</option>
      </select>
    </div>
  );
}
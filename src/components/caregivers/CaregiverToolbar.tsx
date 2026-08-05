import { Input } from "../../components/ui";

interface CaregiverToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function CaregiverToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: CaregiverToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:w-80">
        <Input
          placeholder="Search caregivers..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-4 py-2"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>
  );
}
import { Input } from "../../components/ui";

interface ReportToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  category: string;
  onCategoryChange: (value: string) => void;
}

export default function ReportToolbar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
}: ReportToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      <div className="w-full md:w-80">
        <Input
          placeholder="Search reports..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <select
        className="rounded-lg border p-3"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="All">All Categories</option>
        <option value="Patients">Patients</option>
        <option value="Caregivers">Caregivers</option>
        <option value="Assignments">Assignments</option>
        <option value="Appointments">Appointments</option>
      </select>

    </div>
  );
}
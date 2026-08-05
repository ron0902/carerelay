import { Search } from "lucide-react";

interface PatientToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function PatientToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: PatientToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      {/* Search */}
      <div className="relative w-full lg:w-96">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search patient..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <select className="rounded-xl border border-gray-300 px-4 py-3">
          <option>Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>

        <select className="rounded-xl border border-gray-300 px-4 py-3">
          <option>Sort</option>
          <option>Name A-Z</option>
          <option>Name Z-A</option>
          <option>Age</option>
        </select>

      </div>

    </div>
  );
}
import { Search } from "lucide-react";

interface OrganizationToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export default function OrganizationToolbar({
  search,
  onSearchChange,
  status,
  onStatusChange,
}: OrganizationToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

      {/* Search */}
      <div className="relative w-full md:max-w-md">

        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search organization..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white py-2 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

      </div>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-xl border border-gray-300 bg-white px-4 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
      >
        <option value="All">All Status</option>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>

    </div>
  );
}
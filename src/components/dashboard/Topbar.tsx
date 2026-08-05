import {
  Bell,
  ChevronDown,
  MessageSquare,
  Moon,
  Search,
} from "lucide-react";

export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b bg-white px-8 shadow-sm">

      {/* Left */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back to CareRelay
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-80 rounded-xl border border-gray-200 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none"
          />

        </div>

        {/* Dark Mode */}

        <button className="rounded-xl p-2 hover:bg-gray-100">
          <Moon size={20} />
        </button>

        {/* Messages */}

        <button className="relative rounded-xl p-2 hover:bg-gray-100">

          <MessageSquare size={20} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            2
          </span>

        </button>

        {/* Notifications */}

        <button className="relative rounded-xl p-2 hover:bg-gray-100">

          <Bell size={20} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            5
          </span>

        </button>

        {/* Profile */}

        <button className="flex items-center gap-3 rounded-xl border px-3 py-2 hover:bg-gray-50">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 font-bold text-white">
            A
          </div>

          <div className="text-left">

            <p className="font-semibold">
              Administrator
            </p>

            <p className="text-xs text-gray-500">
              System Administrator
            </p>

          </div>

          <ChevronDown size={18} />

        </button>

      </div>

    </header>
  );
}
import {
  CalendarDays,
  Clock,
  Bell,
  User,
  HeartPulse,
  ArrowRight,
  MapPin,
} from "lucide-react";

import { Button, Card } from "../../components/ui";

export default function PatientDashboardPage() {
  const patient = {
    name: "Maria Santos",
    caregiver: "John Reyes",
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-blue-600 to-cyan-500 p-0 text-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-6 sm:px-8 sm:py-7">
          <div>
            <p className="text-sm text-blue-100">
              Good Morning 👋
            </p>

            <h1 className="mt-1 text-4xl font-bold">
              {patient.name}
            </h1>

            <p className="mt-2 text-sm text-blue-100 sm:text-base">
              Here's your care overview for today.
            </p>
          </div>

          <div className="hidden rounded-full bg-white/15 p-5 sm:block">
            <HeartPulse size={46} />
          </div>
        </div>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Next Visit
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                9:00 AM
              </h2>
            </div>

            <div className="rounded-xl bg-blue-100 p-4 text-blue-600">
              <CalendarDays size={25} />
            </div>
          </div>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Upcoming
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                3
              </h2>
            </div>

            <div className="rounded-xl bg-green-100 p-4 text-green-600">
              <Clock size={25} />
            </div>
          </div>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-sm text-gray-500">
                Caregiver
              </p>

              <h2 className="mt-2 truncate text-xl font-bold">
                {patient.caregiver}
              </h2>
            </div>

            <div className="rounded-xl bg-purple-100 p-4 text-purple-600">
              <User size={25} />
            </div>
          </div>
        </Card>

        <Card className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Notifications
              </p>

              <h2 className="mt-2 text-4xl font-bold">
                2
              </h2>
            </div>

            <div className="rounded-xl bg-yellow-100 p-4 text-yellow-600">
              <Bell size={25} />
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 xl:grid-cols-3">
        {/* Today's Appointment */}
        <Card className="xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Today's Appointment
              </h2>

              <p className="text-sm text-gray-500">
                Your next scheduled care visit.
              </p>
            </div>

            <CalendarDays
              size={26}
              className="text-blue-600"
            />
          </div>

          <div className="rounded-xl border p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Home Care Visit
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  With {patient.caregiver}
                </p>
              </div>

              <span className="w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                Confirmed
              </span>
            </div>

            <div className="mt-5 grid gap-3 text-sm text-gray-500 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                <span>Today</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>9:00 AM - 12:00 PM</span>
              </div>

              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{patient.caregiver}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>General Santos City</span>
              </div>
            </div>

            <div className="mt-5">
              <Button>
                View Appointment
              </Button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Recent Notifications
              </h2>

              <p className="text-sm text-gray-500">
                Your latest updates.
              </p>
            </div>

            <Bell
              size={25}
              className="text-yellow-500"
            />
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border p-4 transition hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Appointment Confirmed
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Your visit tomorrow has been confirmed.
                  </p>
                </div>

                <span className="shrink-0 text-xs text-gray-400">
                  1 hr
                </span>
              </div>
            </div>

            <div className="rounded-xl border p-4 transition hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    Caregiver Updated
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    John Reyes is assigned to your care.
                  </p>
                </div>

                <span className="shrink-0 text-xs text-gray-400">
                  Yesterday
                </span>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full"
            >
              View All Notifications
            </Button>
          </div>
        </Card>
      </div>

      {/* Caregiver */}
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              My Caregiver
            </h2>

            <p className="text-sm text-gray-500">
              Your assigned primary caregiver.
            </p>
          </div>

          <User
            size={26}
            className="text-blue-600"
          />
        </div>

        <div className="flex flex-col gap-5 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User size={28} />
            </div>

            <div>
              <h3 className="text-lg font-semibold">
                {patient.caregiver}
              </h3>

              <p className="text-sm text-gray-500">
                Primary Caregiver • Available
              </p>
            </div>
          </div>

          <Button variant="secondary">
            View Profile
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Quick Actions
            </h2>

            <p className="text-sm text-gray-500">
              Quickly access your care information.
            </p>
          </div>

          <ArrowRight
            size={24}
            className="text-blue-600"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            type="button"
            className="flex items-center justify-between rounded-xl border p-5 text-left transition hover:border-blue-500 hover:bg-blue-50"
          >
            <div>
              <h3 className="font-semibold">
                My Appointments
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View upcoming visits
              </p>
            </div>

            <ArrowRight size={20} />
          </button>

          <button
            type="button"
            className="flex items-center justify-between rounded-xl border p-5 text-left transition hover:border-green-500 hover:bg-green-50"
          >
            <div>
              <h3 className="font-semibold">
                My Caregiver
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                View caregiver information
              </p>
            </div>

            <ArrowRight size={20} />
          </button>
        </div>
      </Card>
    </div>
  );
}
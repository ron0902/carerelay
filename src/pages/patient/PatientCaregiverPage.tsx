import {
  User,
  Phone,
  Mail,
  MapPin,
  BriefcaseMedical,
  CalendarDays,
  Clock,
  MessageCircle,
  Star,
} from "lucide-react";

import { Button, Card } from "../../components/ui";

export default function PatientCaregiverPage() {
  const caregiver = {
    name: "John Reyes",
    specialty: "Elder Care Specialist",
    experience: 6,
    phone: "09123456789",
    email: "john.reyes@example.com",
    location: "General Santos City",
    availability: "Available",
    assignedSince: "July 15, 2026",
    rating: 4.9,
    completedVisits: 152,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          My Caregiver
        </h1>

        <p className="text-gray-500">
          View your assigned caregiver and care information.
        </p>
      </div>

      {/* Profile Header */}
      <Card className="overflow-hidden border-0 p-0 shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
                <User size={48} />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-3xl font-bold">
                    {caregiver.name}
                  </h2>

                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-white">
                    {caregiver.availability}
                  </span>
                </div>

                <p className="mt-2 text-blue-100">
                  {caregiver.specialty}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-blue-100">
                  <span className="flex items-center gap-1">
                    <Star size={15} className="fill-current" />
                    {caregiver.rating} Rating
                  </span>

                  <span>
                    {caregiver.experience} Years Experience
                  </span>

                  <span>
                    {caregiver.completedVisits} Completed Visits
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              className="w-full bg-white text-gray-700 hover:bg-gray-100 sm:w-auto"
            >
              <MessageCircle size={18} />
              <span className="ml-2">Contact Caregiver</span>
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Assigned Since
            </p>

            <p className="mt-1 font-semibold">
              {caregiver.assignedSince}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Experience
            </p>

            <p className="mt-1 font-semibold">
              {caregiver.experience} Years
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Completed Visits
            </p>

            <p className="mt-1 font-semibold">
              {caregiver.completedVisits}
            </p>
          </div>
        </div>
      </Card>

      {/* Contact + Professional */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <User size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Contact Information
              </h2>

              <p className="text-sm text-gray-500">
                Get in touch with your caregiver.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-start gap-3">
              <Phone
                size={18}
                className="mt-0.5 shrink-0 text-gray-400"
              />

              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="mt-1 font-medium">
                  {caregiver.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail
                size={18}
                className="mt-0.5 shrink-0 text-gray-400"
              />

              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-words font-medium">
                  {caregiver.email}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-gray-400"
              />

              <div className="min-w-0">
                <p className="text-sm text-gray-500">
                  Service Area
                </p>

                <p className="mt-1 font-medium">
                  {caregiver.location}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <BriefcaseMedical size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Professional Information
              </h2>

              <p className="text-sm text-gray-500">
                Caregiver experience and qualifications.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-sm text-gray-500">
                Specialty
              </p>

              <p className="mt-1 font-medium">
                {caregiver.specialty}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Years of Experience
              </p>

              <p className="mt-1 font-medium">
                {caregiver.experience} Years
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Availability
              </p>

              <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {caregiver.availability}
              </span>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Rating
              </p>

              <div className="mt-1 flex items-center gap-2">
                <Star
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />

                <span className="font-medium">
                  {caregiver.rating} / 5.0
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Visits */}
      <Card>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Upcoming Care Visits
            </h2>

            <p className="text-sm text-gray-500">
              Your next scheduled visits with {caregiver.name}.
            </p>
          </div>

          <CalendarDays
            size={26}
            className="text-blue-600"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border p-5 transition hover:shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="font-semibold">
                    Home Care Visit
                  </h3>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    Scheduled
                  </span>
                </div>

                <div className="mt-3 grid gap-2 text-sm text-gray-500 sm:grid-cols-2">
                  <span className="flex items-center gap-2">
                    <CalendarDays size={16} />
                    August 01, 2026
                  </span>

                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    9:00 AM - 12:00 PM
                  </span>
                </div>
              </div>

              <Button variant="secondary">
                View Appointment
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button variant="secondary">
            View All Appointments
          </Button>
        </div>
      </Card>
    </div>
  );
}
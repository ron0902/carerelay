import {
  ClipboardList,
  HeartPulse,
  User,
  CheckCircle,
  Clock,
  CalendarDays,
  Activity,
} from "lucide-react";

import { Button, Card } from "../../components/ui";

export default function PatientCarePlanPage() {
  const carePlan = {
    condition: "Hypertension Management",
    caregiver: "John Reyes",
    startDate: "July 15, 2026",
    reviewDate: "August 15, 2026",
    status: "Active",
    progress: 72,
  };

  const goals = [
    {
      title: "Blood Pressure Monitoring",
      description:
        "Monitor and record your blood pressure regularly.",
      status: "In Progress",
      progress: 70,
    },
    {
      title: "Medication Adherence",
      description:
        "Take prescribed medication according to your care schedule.",
      status: "In Progress",
      progress: 80,
    },
    {
      title: "Follow-up Care",
      description:
        "Attend scheduled medical and caregiver follow-up visits.",
      status: "Completed",
      progress: 100,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          My Care Plan
        </h1>

        <p className="text-gray-500">
          View your current care plan, goals, and care instructions.
        </p>
      </div>

      {/* Care Plan Header */}
      <Card className="overflow-hidden border-0 p-0 shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/15 p-3">
                <HeartPulse size={30} />
              </div>

              <div>
                <p className="text-sm text-blue-100">
                  Current Care Plan
                </p>

                <h2 className="text-2xl font-bold">
                  {carePlan.condition}
                </h2>

                <p className="mt-1 text-sm text-blue-100">
                  Managed with your assigned caregiver.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold">
              {carePlan.status}
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Caregiver
            </p>

            <p className="mt-1 flex items-center gap-2 font-semibold">
              <User size={16} />
              {carePlan.caregiver}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Started
            </p>

            <p className="mt-1 flex items-center gap-2 font-semibold">
              <CalendarDays size={16} />
              {carePlan.startDate}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Next Review
            </p>

            <p className="mt-1 flex items-center gap-2 font-semibold">
              <Clock size={16} />
              {carePlan.reviewDate}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Overall Progress
            </p>

            <div className="mt-2 flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{
                    width: `${carePlan.progress}%`,
                  }}
                />
              </div>

              <span className="text-sm font-semibold">
                {carePlan.progress}%
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Goals */}
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
            <ClipboardList size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Care Goals
            </h2>

            <p className="text-sm text-gray-500">
              Track your progress toward your current care goals.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.title}
              className="rounded-xl border p-5 transition hover:shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold">
                      {goal.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        goal.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {goal.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {goal.description}
                  </p>
                </div>

                <Activity
                  size={20}
                  className="shrink-0 text-gray-400"
                />
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${
                      goal.status === "Completed"
                        ? "bg-green-500"
                        : "bg-blue-600"
                    }`}
                    style={{
                      width: `${goal.progress}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Care Instructions */}
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
            <HeartPulse size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Care Instructions
            </h2>

            <p className="text-sm text-gray-500">
              Important information related to your care.
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-gray-50 p-5">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle
                size={18}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <p className="text-sm text-gray-700">
                Take medications according to the prescribed schedule.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle
                size={18}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <p className="text-sm text-gray-700">
                Record your blood pressure as instructed by your caregiver.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle
                size={18}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <p className="text-sm text-gray-700">
                Keep all scheduled caregiver and medical appointments.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle
                size={18}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <p className="text-sm text-gray-700">
                Contact your caregiver if you experience unusual symptoms.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button>
            View My Appointments
          </Button>

          <Button variant="secondary">
            Contact Caregiver
          </Button>
        </div>
      </Card>
    </div>
  );
}
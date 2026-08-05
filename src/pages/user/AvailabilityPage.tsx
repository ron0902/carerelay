import { useState } from "react";
import { Button, Card } from "../../components/ui";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";

export interface Availability {
  day: string;
  enabled: boolean;
  startTime: string;
  endTime: string;
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([
    {
      day: "Monday",
      enabled: true,
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      day: "Tuesday",
      enabled: true,
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      day: "Wednesday",
      enabled: true,
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      day: "Thursday",
      enabled: false,
      startTime: "",
      endTime: "",
    },
    {
      day: "Friday",
      enabled: true,
      startTime: "08:00",
      endTime: "17:00",
    },
    {
      day: "Saturday",
      enabled: false,
      startTime: "",
      endTime: "",
    },
    {
      day: "Sunday",
      enabled: false,
      startTime: "",
      endTime: "",
    },
  ]);

  const updateAvailability = (
    index: number,
    field: keyof Availability,
    value: string | boolean
  ) => {
    setAvailability((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const weeklyHours = availability.filter((item) => item.enabled).length * 8;

  const handleSave = () => {
    console.log("Availability saved:", availability);
  };

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-blue-100">Availability</p>
            <h1 className="mt-2 text-3xl font-bold">Manage your preferred working hours.</h1>
          </div>
          <div className="rounded-full bg-white/20 p-4">
            <CalendarDays size={32} />
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border p-5 transition hover:shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Availability Status</h2>
              <p className="text-sm text-gray-500">Available for Assignments</p>
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="text-sm font-medium text-slate-700">Toggle Switch</span>
            <input
              type="checkbox"
              checked
              className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              readOnly
            />
          </label>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <Card>
          <div className="mb-5 flex items-center gap-3">
            <Clock className="text-blue-600" size={22} />
            <div>
              <h2 className="text-xl font-semibold">Weekly Schedule</h2>
              <p className="text-sm text-gray-500">Set your preferred working hours for each day.</p>
            </div>
          </div>

          <div className="space-y-3">
            {availability.map((item, index) => (
              <div
                key={item.day}
                className="rounded-xl border p-4 transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={(e) =>
                        updateAvailability(index, "enabled", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-700">{item.day}</span>
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="text-sm text-slate-500">Start</span>
                      <input
                        type="time"
                        value={item.startTime}
                        disabled={!item.enabled}
                        onChange={(e) =>
                          updateAvailability(index, "startTime", e.target.value)
                        }
                        className="bg-transparent text-sm outline-none disabled:text-slate-400"
                      />
                    </label>

                    <span className="text-sm text-slate-400">to</span>

                    <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                      <span className="text-sm text-slate-500">End</span>
                      <input
                        type="time"
                        value={item.endTime}
                        disabled={!item.enabled}
                        onChange={(e) =>
                          updateAvailability(index, "endTime", e.target.value)
                        }
                        className="bg-transparent text-sm outline-none disabled:text-slate-400"
                      />
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Weekly Hours</h2>
              <p className="text-sm text-gray-500">Your preferred weekly schedule overview.</p>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-700">Total Hours</p>
              <p className="mt-2 text-4xl font-bold text-blue-800">{weeklyHours} Hours</p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-500">Preferred Shift</p>
              <p className="mt-2 text-lg font-semibold text-slate-700">Morning</p>
            </div>

            <Button className="w-full" onClick={handleSave}>
              Save Availability
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
import { Card } from "../../components/ui";

export default function MyAppointmentsPage() {
  const appointments = [
    {
      id: 1,
      caregiver: "John Reyes",
      date: "2026-07-20",
      time: "10:00 AM",
      status: "Upcoming",
    },
    {
      id: 2,
      caregiver: "John Reyes",
      date: "2026-07-25",
      time: "2:00 PM",
      status: "Upcoming",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          My Appointments
        </h1>

        <p className="text-gray-500">
          View your scheduled care appointments.
        </p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="p-4">Caregiver</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b"
                >
                  <td className="p-4">
                    {appointment.caregiver}
                  </td>

                  <td className="p-4">
                    {appointment.date}
                  </td>

                  <td className="p-4">
                    {appointment.time}
                  </td>

                  <td className="p-4">
                    {appointment.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
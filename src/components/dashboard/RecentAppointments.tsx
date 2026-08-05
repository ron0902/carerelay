import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold">
        Quick Actions
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <button
          onClick={() => navigate("/patients")}
          className="rounded-lg bg-blue-600 p-4 text-white transition hover:bg-blue-700"
        >
          👨‍⚕️
          <p className="mt-2 font-semibold">
            Add Patient
          </p>
        </button>

        <button
          onClick={() => navigate("/caregivers")}
          className="rounded-lg bg-green-600 p-4 text-white transition hover:bg-green-700"
        >
          🩺
          <p className="mt-2 font-semibold">
            Add Caregiver
          </p>
        </button>

        <button
          onClick={() => navigate("/appointments")}
          className="rounded-lg bg-yellow-500 p-4 text-white transition hover:bg-yellow-600"
        >
          📅
          <p className="mt-2 font-semibold">
            Schedule Appointment
          </p>
        </button>

        <button
          onClick={() => navigate("/organizations")}
          className="rounded-lg bg-purple-600 p-4 text-white transition hover:bg-purple-700"
        >
          🏥
          <p className="mt-2 font-semibold">
            Register Organization
          </p>
        </button>
      </div>
    </div>
  );
}
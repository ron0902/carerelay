export default function DashboardGreeting() {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
      <h1 className="text-3xl font-bold">
        {greeting}, Administrator 👋
      </h1>

      <p className="mt-2 text-blue-100">
        Welcome back to CareRelay. Here's what's happening today.
      </p>
    </div>
  );
}
interface UpcomingVisitCardProps {
  patient: string;
  caregiver: string;
  time: string;
  status: string;
}

export default function UpcomingVisitCard({
  patient,
  caregiver,
  time,
  status,
}: UpcomingVisitCardProps) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">{patient}</h3>
          <p className="text-sm text-gray-500">{caregiver}</p>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          {status}
        </span>
      </div>

      <p className="mt-4 text-sm text-gray-500">{time}</p>
    </div>
  );
}
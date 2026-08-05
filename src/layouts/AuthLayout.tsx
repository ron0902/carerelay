import {
  HeartPulse,
  ShieldCheck,
  Users,
  CalendarDays,
} from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gray-100 lg:grid lg:grid-cols-2">
      {/* Left Branding Panel */}
      <div className="relative hidden min-h-screen overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white lg:flex">
        {/* Decorative circles */}
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-cyan-300/10" />

        <div className="relative flex w-full flex-col justify-between p-12 xl:p-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/15 p-3 backdrop-blur-sm">
                <HeartPulse size={32} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  CareRelay
                </h1>

                <p className="text-sm text-blue-100">
                  Healthcare Management System
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
              Connected Care
            </p>

            <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
              Connecting people to better healthcare.
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-blue-100">
              CareRelay brings patients, caregivers, and healthcare
              organizations together through one modern platform.
            </p>

            {/* Feature Highlights */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <ShieldCheck size={22} />

                <p className="mt-3 text-sm font-semibold">
                  Secure
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Protected account access
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <Users size={22} />

                <p className="mt-3 text-sm font-semibold">
                  Connected
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Patients and caregivers
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <CalendarDays size={22} />

                <p className="mt-3 text-sm font-semibold">
                  Organized
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Care and appointments
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-blue-100">
            © 2026 CareRelay
          </div>
        </div>
      </div>

      {/* Right Authentication Panel */}
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
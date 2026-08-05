import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Button, Card, Input } from "../../components/ui";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleReset = () => {
    setError("");

    if (!password.trim()) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    alert("Password reset successfully!");
    navigate("/login");
  };

  return (
    <Card className="w-full max-w-md border-0 bg-white p-8 shadow-xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <HeartPulse size={34} />
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Reset Password
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Create a new password for your CareRelay account.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <div className="space-y-5">
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
        />

        {/* Password requirements */}
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Password requirements
          </p>

          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={14}
                className={
                  password.length >= 8
                    ? "text-green-500"
                    : "text-gray-300"
                }
              />

              <span>
                At least 8 characters
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2
                size={14}
                className={
                  password &&
                  confirmPassword &&
                  password === confirmPassword
                    ? "text-green-500"
                    : "text-gray-300"
                }
              />

              <span>
                Passwords match
              </span>
            </div>
          </div>
        </div>

        {/* Reset */}
        <Button
          className="w-full"
          onClick={handleReset}
        >
          <LockKeyhole size={18} />
          <span className="ml-2">
            Reset Password
          </span>
        </Button>
      </div>

      {/* Security */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck size={15} />

        <span>
          Your password is securely protected.
        </span>
      </div>

      <div className="my-6 border-t" />

      {/* Back */}
      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </Card>
  );
}
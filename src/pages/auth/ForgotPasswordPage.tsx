import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  HeartPulse,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button, Card, Input } from "../../components/ui";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    console.log("Send OTP to:", email);
  };

  return (
    <Card className="w-full max-w-md border-0 bg-white p-8 shadow-xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <HeartPulse size={34} />
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Forgot Password?
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          No worries. Enter your email address and we'll
          send you a verification code to reset your password.
        </p>
      </div>

      {/* Email field */}
      <div>
        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Button */}
      <div className="mt-6">
        <Button
          className="w-full"
          onClick={handleSubmit}
        >
          <Mail size={18} />
          <span className="ml-2">
            Send Verification Code
          </span>
        </Button>
      </div>

      {/* Security message */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck size={15} />

        <span>
          Your account information is protected.
        </span>
      </div>

      <div className="my-6 border-t" />

      {/* Back */}
      <div className="text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>
      </div>
    </Card>
  );
}
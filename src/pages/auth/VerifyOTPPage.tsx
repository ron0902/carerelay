import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

import { Button, Card } from "../../components/ui";

export default function VerifyOTPPage() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const next = document.getElementById(
        `otp-${index + 1}`
      ) as HTMLInputElement | null;

      next?.focus();
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (
      event.key === "Backspace" &&
      !otp[index] &&
      index > 0
    ) {
      const previous = document.getElementById(
        `otp-${index - 1}`
      ) as HTMLInputElement | null;

      previous?.focus();
    }
  };

  const handleVerify = () => {
    console.log("OTP:", otp.join(""));
    navigate("/reset-password");
  };

  const isComplete = otp.every(
    (digit) => digit !== ""
  );

  return (
    <Card className="w-full max-w-md border-0 bg-white p-8 shadow-xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <HeartPulse size={34} />
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Verify Your Email
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Enter the 6-digit verification code sent to
          your email address.
        </p>
      </div>

      {/* OTP fields */}
      <div className="mb-6 flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleChange(
                e.target.value,
                index
              )
            }
            onKeyDown={(e) =>
              handleKeyDown(e, index)
            }
            className={`h-14 w-12 rounded-xl border text-center text-2xl font-semibold transition focus:outline-none sm:h-16 sm:w-14 ${
              digit
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white"
            } focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
          />
        ))}
      </div>

      {/* Timer */}
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-500">
          Code expires in{" "}
          <span className="font-semibold text-gray-700">
            01:59
          </span>
        </p>
      </div>

      {/* Verify button */}
      <Button
        className="w-full"
        onClick={handleVerify}
        disabled={!isComplete}
      >
        <CheckCircle2 size={18} />
        <span className="ml-2">
          Verify Code
        </span>
      </Button>

      {/* Resend */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Didn't receive the code?
        </p>

        <button
          type="button"
          className="mt-1 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Resend Code
        </button>
      </div>

      {/* Security */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck size={15} />

        <span>
          Your verification is secure.
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
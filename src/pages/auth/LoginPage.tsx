import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  Alert,
  Button,
  Card,
  Input,
} from "../../components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const newErrors = {
      email: "",
      password: "",
    };

    setMessage("");

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setMessage(
        "Login successful! Backend authentication will be connected later."
      );
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md border-0 bg-white p-8 shadow-xl">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
          <HeartPulse size={34} />
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
          CareRelay
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Healthcare Management System
        </p>
      </div>

      {/* Heading */}
      <div className="mb-7">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome Back
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to access your CareRelay account.
        </p>
      </div>

      {/* Success */}
      {message && (
        <div className="mb-5">
          <Alert variant="success">
            {message}
          </Alert>
        </div>
      )}

      {/* Form */}
      <div className="space-y-5">
        <div>
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        {/* Password row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              id="remember"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />

            <label
              htmlFor="remember"
              className="text-sm text-gray-500"
            >
              Remember me
            </label>
          </div>

          <Link
            to="/forgot-password"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login button */}
        <Button
          className="w-full"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </div>

      {/* Security */}
      <div className="mt-7 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck size={15} />

        <span>
          Your account information is protected.
        </span>
      </div>

      <div className="my-6 border-t" />

      {/* Footer */}
      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Mail size={13} />
          Secure Login
        </span>

        <span>•</span>

        <span className="flex items-center gap-1">
          <LockKeyhole size={13} />
          Version 1.0.0
        </span>
      </div>
    </Card>
  );
}
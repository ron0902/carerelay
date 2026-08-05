import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  HeartPulse,
  ShieldCheck,
  PhoneCall,
  Lock,
  Edit3,
} from "lucide-react";

import { Button, Card, Input } from "../../components/ui";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState({
    name: "Maria Santos",
    email: "maria.santos@example.com",
    phone: "09123456789",
    address: "General Santos City",
    bloodType: "O+",
    emergencyContact: "Ana Santos",
    emergencyPhone: "09987654321",
    relationship: "Daughter",
  });

  const [editing, setEditing] = useState(false);

  const handleChange = (
    field: keyof typeof profile,
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>

          <p className="text-gray-500">
            Manage your personal and contact information.
          </p>
        </div>

        <Button
          variant={editing ? "secondary" : "primary"}
          onClick={() => setEditing((value) => !value)}
        >
          <Edit3 size={18} />
          <span className="ml-2">
            {editing ? "Cancel Editing" : "Edit Profile"}
          </span>
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="overflow-hidden border-0 p-0 shadow-sm">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-7 text-white sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-lg">
                <User size={48} />
              </div>

              <div>
                <h2 className="text-3xl font-bold">
                  {profile.name}
                </h2>

                <p className="mt-1 text-blue-100">
                  Patient
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-blue-100">
                  <HeartPulse size={16} />
                  CareRelay Patient Portal
                </div>
              </div>
            </div>

            <div className="hidden rounded-full bg-white/15 p-4 sm:block">
              <HeartPulse size={30} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 sm:grid-cols-3">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Blood Type</p>

            <p className="mt-1 text-lg font-semibold">
              {profile.bloodType}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Account Type
            </p>

            <p className="mt-1 text-lg font-semibold">
              Patient
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-sm text-gray-500">
              Account Status
            </p>

            <span className="mt-1 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              Active
            </span>
          </div>
        </div>
      </Card>

      {/* Personal + Contact */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <User size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Personal Information
              </h2>

              <p className="text-sm text-gray-500">
                Your basic patient information.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {editing ? (
              <>
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                />

                <Input
                  label="Blood Type"
                  value={profile.bloodType}
                  onChange={(e) =>
                    handleChange(
                      "bloodType",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Address"
                  value={profile.address}
                  onChange={(e) =>
                    handleChange(
                      "address",
                      e.target.value
                    )
                  }
                />
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm text-gray-500">
                    Full Name
                  </p>

                  <p className="mt-1 font-medium">
                    {profile.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Blood Type
                  </p>

                  <p className="mt-1 font-medium">
                    {profile.bloodType}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Address
                  </p>

                  <p className="mt-1 font-medium">
                    {profile.address}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <Mail size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Contact Information
              </h2>

              <p className="text-sm text-gray-500">
                Your contact details.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {editing ? (
              <>
                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value
                    )
                  }
                />

                <Input
                  label="Address"
                  value={profile.address}
                  onChange={(e) =>
                    handleChange(
                      "address",
                      e.target.value
                    )
                  }
                />
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <Mail
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">
                      Email
                    </p>

                    <p className="mt-1 break-words font-medium">
                      {profile.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div>
                    <p className="text-sm text-gray-500">
                      Phone
                    </p>

                    <p className="mt-1 font-medium">
                      {profile.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-gray-400"
                  />

                  <div>
                    <p className="text-sm text-gray-500">
                      Address
                    </p>

                    <p className="mt-1 font-medium">
                      {profile.address}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Emergency Contact */}
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-red-100 p-3 text-red-600">
            <PhoneCall size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Emergency Contact
            </h2>

            <p className="text-sm text-gray-500">
              Someone we can contact in an emergency.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {editing ? (
            <>
              <Input
                label="Contact Name"
                value={profile.emergencyContact}
                onChange={(e) =>
                  handleChange(
                    "emergencyContact",
                    e.target.value
                  )
                }
              />

              <Input
                label="Relationship"
                value={profile.relationship}
                onChange={(e) =>
                  handleChange(
                    "relationship",
                    e.target.value
                  )
                }
              />

              <Input
                label="Phone Number"
                value={profile.emergencyPhone}
                onChange={(e) =>
                  handleChange(
                    "emergencyPhone",
                    e.target.value
                  )
                }
              />
            </>
          ) : (
            <>
              <div>
                <p className="text-sm text-gray-500">
                  Contact Name
                </p>

                <p className="mt-1 font-medium">
                  {profile.emergencyContact}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Relationship
                </p>

                <p className="mt-1 font-medium">
                  {profile.relationship}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Phone Number
                </p>

                <p className="mt-1 font-medium">
                  {profile.emergencyPhone}
                </p>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Security */}
      <Card>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gray-100 p-3 text-gray-600">
            <ShieldCheck size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Account & Security
            </h2>

            <p className="text-sm text-gray-500">
              Manage your account security.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">
            <Lock size={18} />
            <span className="ml-2">
              Change Password
            </span>
          </Button>

          {editing && (
            <Button onClick={() => setEditing(false)}>
              Save Profile
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
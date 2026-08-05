import { useState } from "react";
import { Button, Card } from "../../components/ui";
import {
  Briefcase,
  HeartHandshake,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import EditProfileModal, {
  type UserProfile,
} from "../../components/user/EditProfileModal";

export default function UserProfilePage() {
  const [user, setUser] = useState<UserProfile>({
    name: "John Reyes",
    email: "john@example.com",
    phone: "09123456789",
    age: 32,
    gender: "Male",
    status: "Active",
  });

  const [openEditModal, setOpenEditModal] = useState(false);

  const handleSaveProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const infoRows = [
    { label: "Full Name", value: user.name, icon: <User size={18} /> },
    { label: "Email", value: user.email, icon: <Mail size={18} /> },
    { label: "Phone", value: user.phone, icon: <Phone size={18} /> },
    { label: "Address", value: "General Santos City", icon: <MapPin size={18} /> },
  ];

  const professionalRows = [
    { label: "Role", value: "Senior Caregiver", icon: <Briefcase size={18} /> },
    { label: "Specialization", value: "Elderly Care, Mobility Support", icon: <ShieldCheck size={18} /> },
    { label: "Experience", value: "8 Years", icon: <HeartHandshake size={18} /> },
    { label: "Account Status", value: user.status, icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500">View and manage your caregiver information.</p>
        </div>

        <Button onClick={() => setOpenEditModal(true)}>Edit Profile</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-xl border p-5 transition hover:shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3 text-blue-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Personal Information</h2>
              <p className="text-sm text-gray-500">Core contact details and address.</p>
            </div>
          </div>

          <div className="space-y-4">
            {infoRows.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-600">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="rounded-xl border p-5 transition hover:shadow-md">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3 text-green-600">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Professional Information</h2>
              <p className="text-sm text-gray-500">Role, experience, and status.</p>
            </div>
          </div>

          <div className="space-y-4">
            {professionalRows.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                <div className="mt-0.5 rounded-full bg-slate-100 p-2 text-slate-600">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{item.label}</p>
                  <p className="font-semibold text-slate-700">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="rounded-xl border p-5 transition hover:shadow-md">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <HeartHandshake size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Emergency Contact</h2>
            <p className="text-sm text-gray-500">Next-of-kin details for urgent support.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-gray-500">Contact Name</p>
            <p className="font-semibold text-slate-700">Maria Reyes</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-gray-500">Relationship</p>
            <p className="font-semibold text-slate-700">Spouse</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-semibold text-slate-700">0912-345-6789</p>
          </div>
          <div className="rounded-lg border border-slate-200 p-3">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold text-slate-700">General Santos City</p>
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border p-5 transition hover:shadow-md">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-full bg-purple-100 p-3 text-purple-600">
            <Lock size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Account Settings</h2>
            <p className="text-sm text-gray-500">Security and account access options.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="secondary">Change Password</Button>
          <Button variant="secondary">Logout</Button>
        </div>
      </Card>

      <EditProfileModal
        open={openEditModal}
        user={user}
        onClose={() => setOpenEditModal(false)}
        onSave={handleSaveProfile}
      />
    </div>
  );
}
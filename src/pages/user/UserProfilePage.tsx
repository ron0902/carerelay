import { useEffect, useState } from "react";
import { Button, Card } from "../../components/ui";
import {
  Briefcase,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import EditProfileModal, {
  type UserProfile,
} from "../../components/user/EditProfileModal";
import ChangePasswordModal from "../../components/user/ChangePasswordModal";
import { useAuth } from "../../context/AuthContext";
import {
  changeCaregiverPassword,
  getCaregiverProfile,
  updateCaregiverProfile,
} from "../../services/caregiverService";

export default function UserProfilePage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    license_number: "",
    specialization: "",
    experience_years: 0,
    bio: "",
    status: "Active",
  });
  const [loading, setLoading] = useState(true);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    loadProfile();
  }, [user?.id]);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await getCaregiverProfile(user.id);

      if (!response.success) {
        console.error(response.message);
        return;
      }

      const profile = response.profile ?? {};

      setUserProfile({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        license_number: profile.license_number ?? "",
        specialization: profile.specialization ?? "",
        experience_years: Number(profile.experience_years ?? 0),
        bio: profile.bio ?? "",
        status: profile.status ?? "Active",
      });
    } catch (error) {
      console.error("Failed to load caregiver profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedUser: UserProfile) => {
    if (!user?.id) {
      throw new Error("Authenticated user ID is unavailable.");
    }

    const response = await updateCaregiverProfile(user.id, {
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      license_number: updatedUser.license_number,
      specialization: updatedUser.specialization,
      experience_years: updatedUser.experience_years,
      bio: updatedUser.bio,
    });

    if (!response.success) {
      throw new Error(response.message || "Unable to update caregiver profile.");
    }

    await loadProfile();
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    if (!user?.id) {
      throw new Error("Authenticated user ID is unavailable.");
    }

    try {
      const response = await changeCaregiverPassword(
        user.id,
        currentPassword,
        newPassword
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to change password.");
      }
    } catch (error) {
      const apiError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        apiError.response?.data?.message ||
        apiError.message ||
        "Failed to change password.";

      throw new Error(message);
    }
  };

  const infoRows = [
    { label: "Full Name", value: `${userProfile.first_name} ${userProfile.last_name}`.trim() || "Not available", icon: <User size={18} /> },
    { label: "Email", value: userProfile.email || "Not available", icon: <Mail size={18} /> },
    { label: "Phone", value: userProfile.phone || "Not available", icon: <Phone size={18} /> },
    { label: "Account Status", value: userProfile.status || "Active", icon: <ShieldCheck size={18} /> },
  ];

  const professionalRows = [
    { label: "Role", value: "Caregiver", icon: <Briefcase size={18} /> },
    { label: "Specialization", value: userProfile.specialization || "Not set", icon: <ShieldCheck size={18} /> },
    { label: "Experience", value: userProfile.experience_years ? `${userProfile.experience_years} Years` : "Not set", icon: <Briefcase size={18} /> },
    { label: "License Number", value: userProfile.license_number || "Not set", icon: <ShieldCheck size={18} /> },
    { label: "Bio", value: userProfile.bio || "Not set", icon: <User size={18} /> },
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

      {loading ? (
        <Card>
          <p className="text-gray-500">Loading profile...</p>
        </Card>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-xl border p-5 transition hover:shadow-md">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  <p className="text-sm text-gray-500">Core account details.</p>
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
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <Lock size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Account Settings</h2>
                <p className="text-sm text-gray-500">Security and account access options.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() => setOpenChangePassword(true)}
              >
                Change Password
              </Button>
              <Button variant="secondary">Logout</Button>
            </div>
          </Card>

          <EditProfileModal
            open={openEditModal}
            user={userProfile}
            onClose={() => setOpenEditModal(false)}
            onSave={handleSaveProfile}
          />

          <ChangePasswordModal
            open={openChangePassword}
            onClose={() => setOpenChangePassword(false)}
            onSave={handleChangePassword}
          />
        </>
      )}
    </div>
  );
}
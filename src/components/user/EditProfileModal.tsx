import { useEffect, useState } from "react";
import { Button, Modal } from "../../components/ui";

export interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  license_number: string;
  specialization: string;
  experience_years: number;
  bio: string;
  status: string;
}

interface EditProfileModalProps {
  open: boolean;
  user: UserProfile;
  onClose: () => void;
  onSave: (user: UserProfile) => Promise<void>;
}

export default function EditProfileModal({
  open,
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [form, setForm] = useState<UserProfile>(user);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(user);
  }, [user, open]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(form);
      onClose();
    } catch (error) {
      console.error("Failed to save caregiver profile:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              First Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.first_name}
              onChange={(e) =>
                setForm({ ...form, first_name: e.target.value })
              }
              placeholder="First name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Last Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.last_name}
              onChange={(e) =>
                setForm({ ...form, last_name: e.target.value })
              }
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email address"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Phone
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Phone number"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              License Number
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.license_number}
              onChange={(e) =>
                setForm({ ...form, license_number: e.target.value })
              }
              placeholder="License number"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Specialization
            </label>
            <input
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
              placeholder="Area of specialization"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Experience
            </label>
            <input
              type="number"
              min="0"
              className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.experience_years}
              onChange={(e) =>
                setForm({
                  ...form,
                  experience_years: Number(e.target.value),
                })
              }
              placeholder="Years of experience"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-slate-600">
              Bio
            </label>
            <textarea
              rows={4}
              className="w-full resize-none rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Tell us about your experience and expertise..."
            />
          </div>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-slate-500">Account Status</p>
          <p className="font-semibold text-slate-700">{form.status}</p>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>

          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
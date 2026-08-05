import { useEffect, useState } from "react";
import { Button, Modal } from "../../components/ui";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  status: string;
}

interface EditProfileModalProps {
  open: boolean;
  user: UserProfile;
  onClose: () => void;
  onSave: (user: UserProfile) => void;
}

export default function EditProfileModal({
  open,
  user,
  onClose,
  onSave,
}: EditProfileModalProps) {
  const [form, setForm] = useState<UserProfile>(user);

  useEffect(() => {
    setForm(user);
  }, [user, open]);

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit Profile">
      <div className="space-y-4">
        <input
          className="w-full rounded-lg border p-3"
          placeholder="Full Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          type="email"
          className="w-full rounded-lg border p-3"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          className="w-full rounded-lg border p-3"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full rounded-lg border p-3"
          placeholder="Age"
          value={form.age}
          onChange={(e) =>
            setForm({
              ...form,
              age: Number(e.target.value),
            })
          }
        />

        <select
          className="w-full rounded-lg border p-3"
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: e.target.value })
          }
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
}
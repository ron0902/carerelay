import { useEffect, useState } from "react";
import { Button, Modal } from "../../components/ui";

interface ChangePasswordModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({
  open,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open]);

  const handleSave = async () => {
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      setError("");
      setSaving(true);
      await onSave(currentPassword, newPassword);
      onClose();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to change password."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Change Password">
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Current Password
          </label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            disabled={saving}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            New Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            disabled={saving}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-600">
            Confirm New Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-200 p-3 outline-none focus:border-blue-500"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            disabled={saving}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <p className="text-xs text-slate-500">
          Your new password must contain at least 8 characters.
        </p>

        <div className="flex justify-end gap-3 border-t pt-4">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Changing..." : "Change Password"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

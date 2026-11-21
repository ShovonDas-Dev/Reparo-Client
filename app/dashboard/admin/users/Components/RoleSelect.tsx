"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateCustomerRole } from "@/lib/API/service";
import { getClientToken } from "@/lib/getClientToken";

// The role dropdown that changes a user's role straight away.
type RoleSelectProps = {
  userId: string;
  currentRole: string;
};

// The three roles an admin can pick.
const ROLES = ["customer", "technician", "admin"];

export default function RoleSelect({ userId, currentRole }: RoleSelectProps) {
  const router = useRouter();

  // The role shown in the dropdown and whether a save is running.
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);

  // Save the new role as soon as the admin picks one.
  const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const newRole = event.target.value;

    // Show the picked role right away.
    setRole(newRole);
    setSaving(true);

    try {
      // Get the JWT for this signed-in admin, then send it with the request.
      const token = await getClientToken();
      await updateCustomerRole(userId, newRole, token);
      toast.success("Role updated");
      router.refresh();
    } catch (err) {
      // Tell the admin and put the old role back.
      toast.error(
        err instanceof Error ? err.message : "Could not change the role.",
      );
      setRole(currentRole);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      aria-label="Change user role"
      value={role}
      onChange={handleChange}
      disabled={saving}
      className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {ROLES.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

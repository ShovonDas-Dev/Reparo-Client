"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateServiceApproval } from "@/lib/API/service";
import { getClientToken } from "@/lib/getClientToken";

// The approval dropdown that saves straight away.
type ApprovalSelectProps = {
  serviceId: string;
  currentStatus: string;
};

// The three approval statuses an admin can pick.
const APPROVAL_OPTIONS = ["pending", "approved", "rejected"];

export default function ApprovalSelect({
  serviceId,
  currentStatus,
}: ApprovalSelectProps) {
  const router = useRouter();

  // The status shown in the dropdown and whether a save is running.
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  // Save the new status as soon as the admin picks one.
  const handleChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;

    // Show the picked status right away.
    setStatus(newStatus);
    setSaving(true);

    try {
      // Get the JWT for this signed-in admin, then send it with the request.
      const token = await getClientToken();
      await updateServiceApproval(serviceId, newStatus, token);
      toast.success("Approval updated");
      router.refresh();
    } catch (err) {
      // Tell the admin and put the old status back.
      toast.error(
        err instanceof Error ? err.message : "Could not update the approval.",
      );
      setStatus(currentStatus);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      aria-label="Change approval status"
      value={status}
      onChange={handleChange}
      disabled={saving}
      className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {APPROVAL_OPTIONS.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

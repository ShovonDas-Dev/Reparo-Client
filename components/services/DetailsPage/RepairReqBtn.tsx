"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AddBookingData } from "@/lib/API/service";

// All the data we collect in the form.
type RepairRequestForm = {
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  address: string;
  problem: string;
};

const EMPTY_FORM: RepairRequestForm = {
  name: "",
  email: "",
  phone: "",
  preferredDate: "",
  address: "",
  problem: "",
};

const labelClass = "text-sm font-medium text-foreground";
const inputClass =
  "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

// Button that opens a dialog with the repair request form.
// serviceId is the current service's MongoDB _id, passed in by the details page.
export default function RepairReqBtn({ serviceId }: { serviceId: string }) {
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<RepairRequestForm>(EMPTY_FORM);

  // Generic change handler: updates whichever field the user typed in.
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Ignore extra clicks while a request is already on its way.
    if (submitting) return;

    const customerId = session?.user?.id;

    if (!customerId) {
      setError("Please sign in before sending a repair request.");
      return;
    }

    // The payload the backend expects — note `problem` is sent as
    // `issueDescription`, and there is no `submittedAt`.
    const bookingData = {
      serviceId,
      customerId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      preferredDate: form.preferredDate,
      address: form.address,
      issueDescription: form.problem,
    };

    setSubmitting(true);
    setError("");

    try {
      await AddBookingData(bookingData);
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while sending your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Reset the form each time the dialog opens, and pre-fill
  // name + email from the logged-in user.
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      setSubmitted(false);
      setError("");
      setForm({
        ...EMPTY_FORM,
        name: session?.user?.name || "",
        email: session?.user?.email || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button className="mt-5 h-10 w-full gap-2">
            Request this repair
            <ArrowRight aria-hidden className="size-4" />
          </Button>
        }
      />

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {submitted ? "Request sent!" : "Request this repair"}
          </DialogTitle>
          <DialogDescription>
            {submitted
              ? "A FixMate professional will contact you soon."
              : "Fill in your details and we will get back to you."}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          // Success state — no form, just a close button.
          <div className="py-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your request has been received. Keep an eye on your email for an
              update.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="repair-name" className={labelClass}>
                Name
              </label>
              <Input
                id="repair-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="repair-email" className={labelClass}>
                Email
              </label>
              <Input
                id="repair-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Phone + preferred date */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="repair-phone" className={labelClass}>
                  Phone
                </label>
                <Input
                  id="repair-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="repair-date" className={labelClass}>
                  Preferred date
                </label>
                <Input
                  id="repair-date"
                  name="preferredDate"
                  type="date"
                  value={form.preferredDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <label htmlFor="repair-address" className={labelClass}>
                Address
              </label>
              <Input
                id="repair-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, area, city"
                required
              />
            </div>

            {/* What is wrong */}
            <div className="space-y-1.5">
              <label htmlFor="repair-problem" className={labelClass}>
                What is wrong?
              </label>
              <textarea
                id="repair-problem"
                name="problem"
                value={form.problem}
                onChange={handleChange}
                placeholder="Describe the issue..."
                rows={3}
                required
                className={`${inputClass} h-auto resize-none py-2`}
              />
            </div>

            {/* Error message, shown when the request fails */}
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting} className="gap-2">
                {submitting && (
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                )}
                {submitting ? "Sending..." : "Send request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

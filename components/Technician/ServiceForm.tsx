"use client";

import Image from "next/image";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  type Variants,
} from "motion/react";
import { uploadImage } from "@/lib/API/imagebb";
import { cn } from "@/lib/utils";
import type {
  FormStatus,
  ServiceFormErrors,
  ServiceFormData,
  ServiceFormProps,
  ServicePayload,
} from "./types";

const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

const EMPTY_FORM: ServiceFormData = {
  title: "",
  category: "",
  description: "",
  basePrice: "",
  estimatedDuration: "",
  serviceMode: "",
  serviceArea: "",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const inputClass =
  "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60";

const formGroup: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const formItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

function validate(form: ServiceFormData, hasImage: boolean): ServiceFormErrors {
  const errors: ServiceFormErrors = {};

  if (form.title.trim().length < 5) {
    errors.title = "Title must be at least 5 characters";
  }
  if (!form.category) {
    errors.category = "Select a category";
  }
  if (form.description.trim().length < 20) {
    errors.description = "Description must be at least 20 characters";
  }
  if (!(Number(form.basePrice) > 0)) {
    errors.basePrice = "Price must be greater than 0";
  }
  if (!form.estimatedDuration.trim()) {
    errors.estimatedDuration = "Duration is required";
  }
  if (!form.serviceMode) {
    errors.serviceMode = "Select a service mode";
  }
  if (!form.serviceArea.trim()) {
    errors.serviceArea = "Service area is required";
  }
  if (!hasImage) {
    errors.image = "Service image is required";
  }

  return errors;
}

type FieldProps = {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
};

function Field({ label, error, className = "", children }: FieldProps) {
  return (
    <motion.div variants={formItem} className={className}>
      <label className="block text-sm font-medium text-foreground">
        {label}
        <span className="mt-1.5 block">{children}</span>
      </label>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </motion.div>
  );
}

export default function ServiceForm({
  technician,
  initialData = null,
  onSubmit,
  submitLabel = "Add Service",
}: ServiceFormProps) {
  const [form, setForm] = useState<ServiceFormData>(() =>
    initialData
      ? {
          title: initialData.title,
          category: initialData.category,
          description: initialData.description,
          basePrice: String(initialData.basePrice),
          estimatedDuration: initialData.estimatedDuration,
          serviceMode: initialData.serviceMode,
          serviceArea: initialData.serviceArea,
        }
      : EMPTY_FORM,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState(initialData?.image ?? "");
  const [errors, setErrors] = useState<ServiceFormErrors>({});
  const [status, setStatus] = useState<FormStatus>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const key = event.target.name as keyof ServiceFormData;
    const value = event.target.value;

    setForm((prev) => ({ ...prev, [key]: value }) as ServiceFormData);
    setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5MB" }));
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form, Boolean(imageFile || initialData?.image));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    setStatus(null);

    try {
      const image = imageFile
        ? await uploadImage(imageFile)
        : (initialData?.image ?? "");

      const serviceData: ServicePayload = {
        title: form.title.trim(),
        category: form.category,
        description: form.description.trim(),
        image,
        basePrice: Number(form.basePrice),
        estimatedDuration: form.estimatedDuration.trim(),
        serviceMode: form.serviceMode,
        serviceArea: form.serviceArea.trim(),
        technicianName: technician.name ?? "",
        technicianEmail: technician.email ?? "",
        approvalStatus: "pending",
        isAvailable: initialData?.isAvailable ?? true,
        createdAt: initialData?.createdAt
          ? new Date(initialData.createdAt)
          : new Date(),
      };

      await onSubmit(serviceData);

      setStatus({
        type: "success",
        message: initialData
          ? "Service updated! Waiting for admin approval."
          : "Service added! Waiting for admin approval.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <motion.form
        onSubmit={handleSubmit}
        variants={formGroup}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-5 rounded-xl border border-border bg-card p-4 sm:p-6 md:grid-cols-2"
      >
        <Field label="Title" error={errors.title} className="md:col-span-2">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. iPhone Screen Replacement"
            className={inputClass}
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Service Mode" error={errors.serviceMode}>
          <select
            name="serviceMode"
            value={form.serviceMode}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select mode</option>
            {SERVICE_MODES.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Base Price (USD)" error={errors.basePrice}>
          <input
            type="number"
            min="1"
            name="basePrice"
            value={form.basePrice}
            onChange={handleChange}
            placeholder="e.g. 25"
            className={inputClass}
          />
        </Field>

        <Field label="Estimated Duration" error={errors.estimatedDuration}>
          <input
            name="estimatedDuration"
            value={form.estimatedDuration}
            onChange={handleChange}
            placeholder="e.g. 2-3 hours"
            className={inputClass}
          />
        </Field>

        <Field
          label="Service Area"
          error={errors.serviceArea}
          className="md:col-span-2"
        >
          <input
            name="serviceArea"
            value={form.serviceArea}
            onChange={handleChange}
            placeholder="e.g. Dhanmondi, Dhaka"
            className={inputClass}
          />
        </Field>

        <Field
          label="Description"
          error={errors.description}
          className="md:col-span-2"
        >
          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            placeholder="What does this service include?"
            className={inputClass}
          />
        </Field>

        <Field
          label="Service Image"
          error={errors.image}
          className="md:col-span-2"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-muted/70"
            />
            <AnimatePresence initial={false}>
              {preview && (
                <motion.div
                  key={preview}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="relative h-28 w-40 shrink-0 overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={preview}
                    alt="Service preview"
                    fill
                    sizes="160px"
                    unoptimized
                    className="object-cover"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Field>

        <Field label="Technician Name">
          <input
            value={technician.name ?? ""}
            readOnly
            disabled
            className={inputClass}
          />
        </Field>

        <Field label="Technician Email">
          <input
            value={technician.email ?? ""}
            readOnly
            disabled
            className={inputClass}
          />
        </Field>

        <AnimatePresence mode="wait">
          {status && (
            <motion.div
              key={status.message}
              role="status"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "rounded-lg border px-4 py-3 text-sm md:col-span-2",
                status.type === "success"
                  ? "border-emerald-600/40 bg-emerald-600/10 text-emerald-700 dark:text-emerald-400"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {status.message}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div variants={formItem} className="md:col-span-2">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Saving..." : submitLabel}
          </motion.button>
        </motion.div>
      </motion.form>
    </MotionConfig>
  );
}

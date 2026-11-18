export type TechnicianInfo = {
  name?: string;
  email?: string;
};

export type ServiceFormData = {
  title: string;
  category: string;
  description: string;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
};

export type ServiceFormErrors = Partial<
  Record<keyof ServiceFormData | "image", string>
>;

export type ServiceApprovalStatus = "pending" | "approved" | "rejected";

export type Service = {
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  isAvailable?: boolean;
  createdAt?: string;
};

export type ServicePayload = {
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: string;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus: ServiceApprovalStatus;
  isAvailable: boolean;
  createdAt: Date;
};

export type FormStatus = {
  type: "success" | "error";
  message: string;
} | null;

export type ServiceFormProps = {
  technician: TechnicianInfo;
  initialData?: Service | null;
  onSubmit: (data: ServicePayload) => void | Promise<void>;
  submitLabel?: string;
};

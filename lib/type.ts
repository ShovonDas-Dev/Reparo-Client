export type IService = {
  _id?: string;
  approvalStatus: "pending" | "approved" | "rejected";
  basePrice: number;
  category: string;
  createdAt: Date | string;
  description: string;
  estimatedDuration: string;
  image: string;
  isAvailable: boolean;
  serviceArea: string;
  serviceMode: "Home Visit" | "Workshop";
  technicianEmail: string;
  technicianName: string;
  title: string;
};

// Shape of the GET /services response (it is paginated, not a plain array).
export type ServicesResponse = {
  services: IService[];
  total: number;
  page: number;
  totalPages: number;
  categoryCounts: Record<string, number>;
};

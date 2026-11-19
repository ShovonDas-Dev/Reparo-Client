import { ServicesResponse } from "../type";
import { ServicePayload } from "@/components/Technician/types";

// Query parameters supported by GET /services.
export type ServiceQueryParams = {
  search?: string;
  category?: string;
  serviceMode?: string;
  sort?: string;
  page?: number;
  limit?: number;
};

// when tecnician added post then work this function
// The technician form sends a ServicePayload (its serviceMode is a plain string).
export const postService = async (serviceData: ServicePayload ) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(serviceData),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to add service");
  }

  return res.json();
};

// GET /services — filters, sorting and pagination all come from the URL.
export const getService = async (
  params: ServiceQueryParams = {}
): Promise<ServicesResponse> => {
  const query = new URLSearchParams();

  // Only add the parameters that actually have a value.
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services?${query.toString()}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch services");
  }

  // Make sure the server really sent the paginated shape before using it.
  const data = (await res.json()) as Partial<ServicesResponse> | null;

  if (!data || !Array.isArray(data.services)) {
    throw new Error("Invalid response from the services API");
  }

  return {
    services: data.services,
    total: data.total ?? 0,
    page: data.page ?? 1,
    totalPages: data.totalPages ?? 1,
    categoryCounts: data.categoryCounts ?? {},
  };
};


export const ServiceDetails = async (id: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch service details");
  }

  return response.json();
};

// The exact data the backend needs to create a booking.
export type BookingPayload = {
  serviceId: string;
  customerId: string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  address: string;
  issueDescription: string;
};

// POST /bookings — creates a new booking on the Express backend.
export const AddBookingData = async (bookingData: BookingPayload) => {
  const res = await fetch("http://localhost:5000/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  // Tell the caller when the request failed (bad request, server error, ...).
  if (!res.ok) {
    throw new Error("Failed to create booking. Please try again.");
  }

  // Some backends answer with an empty body, so don't crash on that.
  return res.json().catch(() => ({}));
};


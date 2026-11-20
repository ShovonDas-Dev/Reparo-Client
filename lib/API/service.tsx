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
export type Booking = {
  _id: string;
  serviceName: string;
  category: string;
  image: string;
  technicianName: string;
  customerName: string;
  preferredDate: string;
  address: string;
  phone: string;
  issueDescription: string;
  amount: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  paymentStatus: "unpaid" | "paid";
  createdAt: string;
};
export type Payment = {
  _id: string;
  bookingId: string;
  customerId: string;
  technicianId?: string;
  amount: number;
  currency: string;
  method: "card";
  status: "paid";
  transactionId: string;
  paidAt: string;
  createdAt: string;
};
// The answer shape of the endpoints that send a list of bookings.
type BookingsResponse = {
  success: boolean;
  message?: string;
  data?: Booking[];
};

// The answer shape of the endpoints that change or create one booking.
type BookingActionResponse = {
  success: boolean;
  message?: string;
  data?: Booking;
};

// The answer shape of the endpoints that send a list of payments.
type PaymentsResponse = {
  success: boolean;
  message?: string;
  data?: Payment[];
};

// One service that a technician added.
export type Service = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;    
  serviceMode: string;
  serviceArea: string;
  technicianName?: string;
  technicianEmail: string;
  approvalStatus: "pending" | "approved" | "rejected";
  isAvailable: boolean;
  postedAt: string;
};

// The answer shape of PATCH /bookings/:id/pay.
type PayBookingResponse = BookingActionResponse & {
  payment?: Payment;
};

// all User api

// One user account.
export type User = {
  _id: string;
  name?: string;
  email?: string;
  role: "customer" | "technician" | "admin";
  image?: string;
  emailVerified?: boolean;
  createdAt?: string;
};

// GET /users — all user accounts for the admin users page.
export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  const data = await res.json();

  // Make sure the server really sent a list before using it.
  if (!Array.isArray(data)) {
    throw new Error("Invalid response from the users API");
  }

  return data;
};

// Change the role of one user (customer, technician or admin)
export const updateCustomerRole = async (userId: string, role: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/user/${userId}/role`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    },  
  );

  const data = await res.json();

  // If the backend says no, show its message
  if (!res.ok) {
    throw new Error(data.message || "Could not change the role.");
  }

  return data;
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


// POST /bookings — creates a new booking on the Express backend.
export const AddBookingData = async (bookingData: BookingPayload) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookingData),
  });

  // Read the JSON body first.
  const data: BookingActionResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed (bad request, server error, ...).
  if (!res.ok) {
    throw new Error(data.message || "Failed to create booking. Please try again.");
  }

  return data;
};

// GET /bookings/customer/:customerId — all bookings of one customer.
export const getCustomerBookings = async (
  customerId: string
): Promise<Booking[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/customer/${encodeURIComponent(customerId)}`
  );

  // Read the JSON body first.
  const data: BookingsResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to load your bookings.");
  }

  return data.data ?? [];
};

// PATCH /bookings/:id/cancel — cancels one booking.
export const cancelBooking = async (bookingId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${encodeURIComponent(bookingId)}/cancel`,
    { method: "PATCH" }
  );

  // Read the JSON body first.
  const data: BookingActionResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to cancel the booking.");
  }

  return data;
};

// PATCH /bookings/:id/pay — pays for one booking and saves a payment record.
// The backend checks that customerId owns the booking before marking it paid.
export const payBooking = async (bookingId: string, customerId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${encodeURIComponent(bookingId)}/pay`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ customerId }),
    }
  );

  // Read the JSON body first.
  const data: PayBookingResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to pay for the booking.");
  }

  return data;
};

// GET /payments?customerId=... — all payments of one customer.
export const getCustomerPayments = async (
  customerId: string
): Promise<Payment[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payments?customerId=${encodeURIComponent(customerId)}`,
    { credentials: "include" }
  );

  // Read the JSON body first.
  const data: PaymentsResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to load your payments.");
  }

  return data.data ?? [];
};

// GET /payments/technician/:technicianId — all payments of one technician.
export const getTechnicianPayments = async (
  technicianId: string
): Promise<Payment[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/payments/technician/${encodeURIComponent(technicianId)}`,
    { credentials: "include" }
  );

  // Read the JSON body first.
  const data: PaymentsResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to load your payments.");
  }

  return data.data ?? [];
};

// GET /bookings/technician/:email — all bookings of one technician.
export const getTechnicianBookings = async (
  email: string
): Promise<Booking[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/technician/${encodeURIComponent(email)}`
  );

  // Read the JSON body first.
  const data: BookingsResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to load your bookings.");
  }

  return data.data ?? [];
};

// PATCH /bookings/:id/status — moves one booking to a new status.
export const updateBookingStatus = async (
  bookingId: string,
  status: Booking["status"]
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/bookings/${encodeURIComponent(bookingId)}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  // Read the JSON body first.
  const data: BookingActionResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to update the booking.");
  }

  return data;
};




export const deleteTechnicianService = async (
  id: string,
  email: string,
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services/technician/${id}/${encodeURIComponent(email)}`,
    {
      method: "DELETE",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete service");
  }

  return data;
};



// GET /services/technician/:email — all services of one technician.
export const getTechnicianServices = async (
  email: string,
): Promise<Service[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services/technician/${encodeURIComponent(email)}`,
  );

  // Read the JSON body first.
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch services");
  }

  return data.data ?? [];
};

// Turn a service on or off (true = available, false = not available)
export const updateServiceAvailability = async (
  serviceId: string,
  isAvailable: boolean
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/services/technician/${serviceId}/availability`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAvailable }),
    }
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Failed to update service");
  }

  return data;
};

// The answer shape of GET /admin/services.
type AdminServicesResponse = {
  success: boolean;
  message?: string;
  data?: Service[];
};

// GET /admin/services — all services for the admin services page.
export const getAdminServices = async (): Promise<Service[]> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/services`
  );

  // Read the JSON body first.
  const data: AdminServicesResponse = await res
    .json()
    .catch(() => ({ success: false }));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Failed to load services.");
  }

  return data.data ?? [];
};

// PATCH /admin/services/:id/approval — approves or rejects one service.
export const updateServiceApproval = async (
  serviceId: string,
  approvalStatus: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/services/${encodeURIComponent(serviceId)}/approval`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ approvalStatus }),
    }
  );

  // Read the JSON body first.
  const data = await res.json().catch(() => ({}));

  // Tell the caller when the request failed.
  if (!res.ok) {
    throw new Error(data.message || "Could not update the approval.");
  }

  return data;
};
"use client";

import ServiceForm from "@/components/Technician/ServiceForm";

import { motion } from "framer-motion";

import { toast } from "sonner";




import { authClient } from "@/lib/auth-client"; // tomar BetterAuth client (path alada hole change koro)

import { ServicePayload } from "@/components/Technician/types";
import { postService } from "@/lib/API/service";
import { getClientToken } from "@/lib/getClientToken";


export default  function  AddServicePage () {

  


  const { data: session } = authClient.useSession();

  

  const technician = {
    name: session?.user?.name,
    email: session?.user?.email,
  };


  // Add button e click korle ei function chole
  const handleAdd = async (serviceData: ServicePayload) => {
  try {
    console.log("Service data:", serviceData);

    // Get the JWT for this signed-in technician.
    const token = await getClientToken();

    // Wait until API request completes
    const response = await postService(serviceData, token);

    console.log("Service response:", response);

    // Show success toast
    toast("New Service Added!", {
      description: "Your service has been successfully added.",
      action: {
        label: "View",
        onClick: () => {
          console.log("View service clicked");
        },
      },
    });

  } catch (error) {
    console.error("Service creation failed:", error);

    toast.error("Failed to add service!", {
      description:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    });
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto w-full max-w-4xl"
    >
  <h1 className="mb-1 text-2xl font-bold text-foreground">
    Add a Service
  </h1>

  <p className="mb-6 text-sm text-muted-foreground">
    Your service will appear on the site after an admin approves it.
  </p>

  <ServiceForm
    technician={technician}
    onSubmit={handleAdd}
    submitLabel="Add Service"
  />
</motion.div>
  );
}


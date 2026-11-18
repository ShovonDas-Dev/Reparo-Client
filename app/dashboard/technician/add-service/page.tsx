"use client";

import ServiceForm from "@/components/Technician/ServiceForm";

import { toast } from "sonner";




import { authClient } from "@/lib/auth-client"; // tomar BetterAuth client (path alada hole change koro)

import { ServicePayload } from "@/components/Technician/types";
import { postService } from "@/lib/API/service";


export default  function  AddServicePage () {

  


  const { data: session } = authClient.useSession();

  

  const technician = {
    name: session?.user?.name,
    email: session?.user?.email,
  };


  // Add button e click korle ei function chole
  const handleAdd = async (serviceData : ServicePayload) => {
    console.log("Service data:", serviceData);

    const response =  postService(serviceData)

    console.log(response)
  

toast("New Service Added!", {
  description: "Your service has been successfully added.",
  action: {
    label: "View",
    onClick: () => {
      console.log("View service clicked");
    },
  },
});
  };

  return (
    <div className="mx-auto w-full max-w-4xl">
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
</div>
  );
}

/* ------------------------------------------------------------------
   Pore Update korar somoy (my-services page e) ei vabe use korba:

   <ServiceForm
     technician={technician}
     initialData={service}            // purono service data
     onSubmit={handleUpdate}          // PATCH /api/services/:id
     submitLabel="Update Service"
   />
------------------------------------------------------------------- */
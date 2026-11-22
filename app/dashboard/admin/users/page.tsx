import * as motion from "framer-motion/client";
import type { Variants } from "framer-motion";
import { getUsers, type User } from "@/lib/API/service";
import { getServerToken } from "@/lib/serverToken";

import UserStatCards from "./Components/UserStatCards";
import UsersTable from "./Components/UsersTable";
import ErrorFallback from "@/components/MyUI/ErrorFallback";

// The page reveal starts the cards and the table rows.
const page: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default async function AllUserDashBoard() {
  // Load the real users from the backend.
  let users: User[] = [];
  let error = "";

  try {
    // Get the JWT for this signed-in admin from Better Auth.
    const token = await getServerToken();
    users = await getUsers(token);
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : // todo: we use a specific components
          "We could not load the users right now. Please try again later.";
  }

  return (
    <motion.div
      variants={page}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl"
    >
      {/* Page title */}
      <motion.div variants={item} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">All users</h1>
        <p className="text-sm text-muted-foreground">
          Every account on Reparo, with a quick way to change a role.
        </p>
      </motion.div>

      {/* Friendly error message when the users cannot be loaded */}
      {error !== "" && (
        <ErrorFallback
          title={error}
          message="We could not load the users right now. Please try again later."
        />
      )}

      {/* The cards and the table only show when the users loaded */}
      {error === "" && (
        <>
          <UserStatCards users={users} />

          <UsersTable users={users} />
        </>
      )}
    </motion.div>
  );
}

import { getUsers, type User } from "@/lib/API/service";

import UserStatCards from "./Components/UserStatCards";
import UsersTable from "./Components/UsersTable";
import ErrorFallback from "@/components/MyUI/ErrorFallback";

export default async function AllUserDashBoard() {
  // Load the real users from the backend.
  let users: User[] = [];
  let error = "";

  try {
    users = await getUsers();
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : // todo: we use a specific components
          "We could not load the users right now. Please try again later.";
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">All users</h1>
        <p className="text-sm text-muted-foreground">
          Every account on Reparo, with a quick way to change a role.
        </p>
      </div>

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
    </div>
  );
}

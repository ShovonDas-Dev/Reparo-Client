import { getUsers, type User } from "@/lib/API/service";

import UserStatCards from "./rootComponents/UserStatCards";
import UsersTable from "./rootComponents/UsersTable";

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
        : "We could not load the users right now. Please try again later.";
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
        <p className="py-10 text-center text-sm text-destructive">{error}</p>
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

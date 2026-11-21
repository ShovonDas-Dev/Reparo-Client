"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { User } from "@/lib/API/service";

import RoleSelect from "./RoleSelect";
import UserDetailsDialog from "./UserDetailsDialog";

// How many users are shown on one page.
const USERS_PER_PAGE = 10;

// Turn "2026-11-20T..." into "20 Nov 2026".
const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// The initials shown when a user has no picture.
const getInitials = (name?: string) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

// The client part of the page: search, filter, table and pagination.
type UsersTableProps = {
  users: User[];
};

export default function UsersTable({ users }: UsersTableProps) {
  // The search text, the role filter and the page we are on.
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // The user shown in the details dialog.
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // A new search always starts again from page 1.
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setCurrentPage(1);
  };

  // A new role filter also starts again from page 1.
  const handleRoleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(event.target.value);
    setCurrentPage(1);
  };

  // Keep the users that match the search text and the role filter.
  const filteredUsers = users.filter((user) => {
    const name = user.name ?? "";
    const email = user.email ?? "";
    const search = searchText.toLowerCase();

    const matchesSearch =
      name.toLowerCase().includes(search) ||
      email.toLowerCase().includes(search);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Work out which users belong on the current page.
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * USERS_PER_PAGE;
  const visibleUsers = filteredUsers.slice(
    startIndex,
    startIndex + USERS_PER_PAGE,
  );

  // These flags pick which message is shown instead of the table.
  const showEmptyList = users.length === 0;
  const showNoMatch = users.length > 0 && filteredUsers.length === 0;
  const showTable = filteredUsers.length > 0;

  return (
    <div className="rounded-xl border border-border">
      {/* Toolbar with the search box and the role filter */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            aria-label="Search users"
            placeholder="Search by name or email"
            value={searchText}
            onChange={handleSearchChange}
            className="h-9 w-full sm:w-64"
          />

          <select
            aria-label="Filter by role"
            value={roleFilter}
            onChange={handleRoleChange}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All roles</option>
            <option value="customer">Customer</option>
            <option value="technician">Technician</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* How many users match the search and filter */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </p>
      </div>

      {showEmptyList && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No users found
        </p>
      )}

      {showNoMatch && (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No users match your search
        </p>
      )}

      {showTable && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email verified</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleUsers.map((user) => (
                <tr key={user._id} className="hover:bg-muted/40">
                  {/* Avatar or initials and the user name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || "User"}
                          width={36}
                          height={36}
                          unoptimized
                          className="size-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          {getInitials(user.name)}
                        </span>
                      )}
                      <p className="font-medium">{user.name || "-"}</p>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 py-3">{user.email || "-"}</td>

                  {/* Role dropdown that saves straight away */}
                  <td className="px-4 py-3">
                    <RoleSelect userId={user._id} currentRole={user.role} />
                  </td>

                  {/* Verified badge */}
                  <td className="px-4 py-3">
                    {user.emailVerified ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                        No
                      </span>
                    )}
                  </td>

                  {/* Joined date */}
                  <td className="px-4 py-3">{formatDate(user.createdAt)}</td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setSelectedUser(user)}
                    >
                      View details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination footer */}
      {showTable && (
        <div className="flex items-center justify-between gap-3 border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Details dialog for the selected user */}
      <UserDetailsDialog
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </div>
  );
}

import React from "react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell, TableCaption } from "@/components/ui/table"; // adjust path as necessary

const headers = [
  { id: "id", name: "ID" },
  { id: "name", name: "Name" },
  { id: "email", name: "Email" },
  { id: "role", name: "Role" },
];
const data = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "Admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "Editor" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "Viewer" },
];

const DataTable = () => {
  return (
    <div className="space-y-4 w-full">
      <h2 className="text-xl font-semibold">User List</h2>
      <Table className="border border-border bg-white">
        {/* <TableCaption>A list of all users and their roles.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;

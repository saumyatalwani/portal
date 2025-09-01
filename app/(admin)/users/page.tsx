"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, PlusIcon } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/common/DataTable";
import React from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { User } from "@/generated/prisma";

export default function Page() {

    const [users,setUsers]=React.useState<any[]>();

  const fields: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Name <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "email",
      header: "email",
    },
  ];

    React.useEffect(() => {
    async function getUsers() {
      const usrs = await authClient.admin.listUsers({
        query: { sortBy: "role" },
      });
      setUsers(usrs.data?.users ?? []);
    }
    getUsers();
  }, []);

  return (
    <React.Fragment>
      <div className="w-full flex items-center">
        <h1 className="text-4xl font-bold">User Management</h1>
        <Link
          href={`/users/add/`}
          className="p-2 bg-black text-white rounded-md my-2 ml-auto"
        >
         <PlusIcon/>
        </Link>
      </div>
      <DataTable columns={fields} data={users ?? []} showSelect={false} pageSize={5} />
    </React.Fragment>
  );
}

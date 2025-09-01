"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { logs } from "@/app/generated/prisma";
import React from "react";

export default function LogTable({data}: {
    data : logs[] | undefined
}) {

  const fields: ColumnDef<logs>[] = [
    {
  accessorKey: "createdAt",
  header: ({ column }) => (
    <Button variant="ghost" onClick={() => column.toggleSorting()}>
      Time <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => {
    const value = row.getValue("createdAt") as string | Date;
    const date = new Date(value);
    return date.toLocaleString(); // e.g. "8/31/2025, 7:15:23 PM"
  },
},
    {
      accessorKey: "type",
      header: "Type"
    },
    {
      accessorKey: "msg",
      header: "Message"
    },
    
  ];

  return (
    <>
      <DataTable
        columns={fields}
        data={data ?? []}
        showSelect={false}
        pageSize={100}
      />
     </>
  );
}

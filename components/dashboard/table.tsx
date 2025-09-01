"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { student } from "@/app/generated/prisma";
import React from "react";

export default function DashboardTable({data}: {
    data : student[] | undefined
}) {

  const fields: ColumnDef<student>[] = [
    {
      accessorKey: "rollNo",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Roll Number <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "name",
      header: "Name"
    },
    {
      accessorKey: "cf_max_rank",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Code Forces Max Rank <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "cf_rank",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CF Current Rank <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "cf_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CForces Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },{
      accessorKey: "cf_max_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CForces Max Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },{
      accessorKey: "lc_badge",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          LeetCode Badge <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "lc_ranking",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          LeetCode Ranking <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "lc_star_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          LeetCode Star Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },{
      accessorKey: "cc_current_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CodeChef Current Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },{
      accessorKey: "cc_max_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CodeChef Max Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },{
      accessorKey: "cc_star_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CodeChef Star Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={fields}
        data={data ?? []}
        showSelect={false}
        pageSize={25}
      />
     </>
  );
}

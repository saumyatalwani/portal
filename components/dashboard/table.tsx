"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/common/DataTable";
import { ArrowUpDown } from "lucide-react";
import { ColumnDef,SortingFn } from "@tanstack/react-table";
import { student } from "@/generated/prisma";
import React from "react";
import { cfRankIndex,lcBadgeIndex } from "./sort";

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
      accessorKey: "placement_status",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          Placement Status <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
    accessorKey: "cf_max_rank",
    accessorFn: (row) => {
      const value = row.cf_max_rank?.toLowerCase() as keyof typeof cfRankIndex | undefined;
      return value ? cfRankIndex[value] : undefined;
    },
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        CF Max Rank <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.cf_max_rank ?? "-",
    sortUndefined: "last",
    sortDescFirst: false, 
  },
    {
    accessorKey: "cf_rank",
    accessorFn: (row) => {
      const value = row.cf_rank?.toLowerCase() as keyof typeof cfRankIndex | undefined;
      return value ? cfRankIndex[value] : undefined;
    },
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting()}>
        CF Current Rank <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.cf_rank ?? "-",
    sortUndefined: "last",
    sortDescFirst: false, 
  },
    {
      accessorKey: "cf_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CF Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row: student) => row.cf_rating ?? undefined,
      sortUndefined: "last",
      sortDescFirst: false, 
    },{
      accessorKey: "cf_max_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CF Max Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row: student) => row.cf_max_rating ?? undefined,
      sortUndefined: "last",
      sortDescFirst: false,
    },{
  accessorKey: "lc_badge",
  accessorFn: (row) => {
    const value = row.lc_badge?.toLowerCase() as keyof typeof lcBadgeIndex | undefined;
    return value ? lcBadgeIndex[value] : undefined; // numeric value for sorting
  },
  header: ({ column }) => (
    <Button variant="ghost" onClick={() => column.toggleSorting()}>
      LC Badge <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => row.original.lc_badge ?? "-",
  sortUndefined: "last",
  sortDescFirst: false
},

    {
      accessorKey: "lc_ranking",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          LC Ranking <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row: student) => row.lc_ranking ?? undefined,
      sortUndefined: "last",
      sortDescFirst: false,
    },
    {
      accessorKey: "lc_star_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          LC Star Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row: student) => row.lc_star_rating ?? undefined,
      sortUndefined: "last",
      sortDescFirst: false,
    },{
      accessorKey: "cc_current_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CC Current Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row: student) => row.cc_current_rating ?? undefined,
      sortUndefined: "last",
      sortDescFirst: false,
    },{
      accessorKey: "cc_max_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CC Max Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row: student) => row.cc_max_rating ?? undefined,
      sortUndefined: "last",
      sortDescFirst: false,
    },{
      accessorKey: "cc_star_rating",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting()}>
          CC Star Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      accessorFn: (row: student) => row.cc_star_rating ?? undefined,
      sortUndefined: "last",
      sortDescFirst: false,
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

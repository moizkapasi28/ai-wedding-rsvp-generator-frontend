import type { ColumnDef } from "@tanstack/react-table"

export type Guest = {
  id: string
  name: string
  email: string
  status: "Attending" | "Declined" | "Pending"
  dietaryRequirements: string
}

export const columns: ColumnDef<Guest>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "dietaryRequirements",
    header: "Dietary Requirements",
  },
]

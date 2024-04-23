"use client";

import { getUser, deleteUser } from "@/actions/user";
import { useModal } from "@/app/providers/modal-provider";
import UserDetails from "@/components/forms/user-details";
import CustomModal from "@/components/global/custom-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { UsersWithAgencySubAccountPermissionsSidebarOptions } from "@/types";
import { Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Copy, Edit, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<UsersWithAgencySubAccountPermissionsSidebarOptions>[] =
  [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const image = row.getValue("image") as string;
        return (
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 relative flex-none">
              <Image
                src={image}
                fill
                className="rounded-full object-cover"
                alt="avatar image"
              />
            </div>
            <span>{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "image",
      header: "",
      cell: () => {
        return null;
      },
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "SubAccount",
      header: "Owned Accounts",
      cell: ({ row }) => {
        const isAgencyOwner = row.getValue("role") === "AGENCY_OWNER";
        const ownedAccounts = row.original?.Permissions.filter(
          (per) => per.access
        );

        if (isAgencyOwner)
          return (
            <div className="flex flex-col items-start">
              <div className="flex flex-col gap-2">
                <Badge className="bg-slate-600 whitespace-nowrap">
                  Agency - {row?.original?.Agency?.name}
                </Badge>
              </div>
            </div>
          );
        return (
          <div className="flex flex-col items-start">
            <div className="flex flex-col gap-2">
              {ownedAccounts?.length ? (
                ownedAccounts.map((account) => (
                  <Badge
                    key={account.id}
                    className="bg-slate-600 w-fit whitespace-nowrap"
                  >
                    Sub Account - {account.SubAccount.name}
                  </Badge>
                ))
              ) : (
                <div className="text-muted-foreground">No Access Yet</div>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role: Role = row.getValue("role");
        return (
          <Badge
            className={cn({
              "bg-emerald-500": role === "AGENCY_OWNER",
              "bg-orange-400": role === "AGENCY_ADMIN",
              "bg-primary": role === "SUBACCOUNT_USER",
              "bg-muted": role === "SUBACCOUNT_GUEST",
            })}
          >
            {role}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const rowData = row.original;

        return <CellActions rowData={rowData} />;
      },
    },
  ];

interface CellActionsProps {
  rowData: UsersWithAgencySubAccountPermissionsSidebarOptions;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { data, setOpen } = useModal();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  if (!rowData) return;
  if (!rowData.Agency) return;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => navigator.clipboard.writeText(rowData?.email)}
          >
            <Copy size={15} /> Copy Email
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal
                  subheading="You can change permissions only when the user has an owned subaccount"
                  title="Edit User Details"
                >
                  <UserDetails
                    type="agency"
                    id={rowData?.Agency?.id || null}
                    subAccounts={rowData?.Agency?.SubAccount}
                  />
                </CustomModal>,
                async () => {
                  return { user: await getUser(rowData?.id) };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          {rowData.role !== "AGENCY_OWNER" && (
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
                <Trash size={15} /> Remove User
              </DropdownMenuItem>
            </AlertDialogTrigger>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the user
            and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive"
            onClick={async () => {
              setLoading(true);
              await deleteUser(rowData.id);
              toast({
                title: "Deleted User",
                description:
                  "The user has been deleted from this agency they no longer have access to the agency",
              });
              setLoading(false);
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

import { db } from "@/lib/db";
import React from "react";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import SendInvitation from "@/components/forms/send-invitation";
import { currentUser } from "@/lib/auth";
import DataTable from "./data-table";
import { redirect } from "next/navigation";
import next from "next";
import Unauthorized from "@/components/unauthorized";
import { Label } from "@/components/ui/label";
import Link from "next/link";

type Props = {
  params: { agencyId: string };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });

  if (!authUser) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <div className="px-10 py-2 flex justify-between border-b items-center">
      <Label>Team</Label>
      <Link
        className="flex items-center gap-2 bg-muted px-2 py-1 border rounded-md hover:bg-muted-foreground/20"
        href={"/"}
      >
        <Plus size={12} />
        <span className="text-xs">Add team</span>
      </Link>
    </div>
    // <DataTable
    //   actionButtonText={
    //     <>
    //       <Plus size={15} />
    //       Add
    //     </>
    //   }
    //   modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
    //   filterValue="name"
    //   columns={columns}
    //   data={teamMembers}
    // ></DataTable>
  );
};

export default TeamPage;

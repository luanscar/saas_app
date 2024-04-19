import { db } from "@/lib/db";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { columns } from "./columns";
import { currentUser } from "@/lib/auth";
import { getUserDetails } from "@/actions/user";

type Props = {
  params: { agencyId: string };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();

  if (!authUser) return null;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });

  const teamMembers = await db.user.findMany({
    where: { email: authUser.email },
    include: {
      Agency: {
        include: {
          SubAccount: { include: { Permissions: true } },
          SidebarOption: true,
        },
      },
      Permissions: true,
    },
  });

  if (!agencyDetails) return;

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      // modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue="name"
      columns={columns}
      data={teamMembers}
    ></DataTable>
  );
};

export default TeamPage;

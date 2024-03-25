import { auth } from "@/auth";
import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import React from "react";

type SettingsPageProps = {
  params: { agencyId: string };
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const authUser = await currentUser();
  if (!authUser) return null;

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.email,
    },
  });

  if (!userDetails) return null;

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
      users: {
        include: {
          Permissions: true,
        },
      },
    },
  });

  if (!agencyDetails) return null;

  const subAccounts = agencyDetails.SubAccount;
  const subAccountsPermissions = agencyDetails.users.flatMap(
    (item) => item.Permissions
  );

  return (
    <>
      <h1>Settings</h1>
      <Separator />
      <div className="flex justify-center items-center flex-col md:flex-row space-x-8 mt-14  w-full">
        <div className="w-[490px]">
          <AgencyDetails data={agencyDetails} />
        </div>
        <div className="w-[490px]">
          <UserDetails
            type="agency"
            id={params.agencyId}
            subAccounts={subAccounts}
            userData={userDetails}
          />
        </div>
      </div>
    </>
  );
}

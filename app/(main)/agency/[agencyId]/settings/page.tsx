import { getUserDetails } from "@/actions/user";
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

  const userAuth = await db.user.findUnique({
    where: {
      email: authUser.email,
    },
  });

  if (!userAuth) return null;

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

  const userDetails = await getUserDetails();

  const subAccounts = userDetails?.Agency?.SubAccount.filter(
    (subaccount) => subaccount.agencyId === agencyDetails?.id
  );

  if (!agencyDetails) return null;

  return (
    <>
      <UserDetails
        id={agencyDetails.id}
        type="agency"
        userDetails={userDetails}
      />
    </>
  );
}

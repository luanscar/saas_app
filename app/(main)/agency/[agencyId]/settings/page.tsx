import { getUserDetails } from "@/actions/user";
import { auth } from "@/auth";
import AgencyDetails from "@/components/forms/agency-details";
import UserDetails from "@/components/forms/user-details";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserDetailsType } from "@/types";
import { CornerDownLeft } from "lucide-react";
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

  const subAccounts = userDetails?.Agency?.SubAccount;

  const userPermissions = userDetails?.Permissions;

  if (!agencyDetails) return null;

  return (
    <div className="px-96">
      <h1 className="md:text-3xl font-semibold">Settings</h1>

      <Separator className="md:my-6 my-3" />
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="md:text-xl font-semibold">Agency Details</h1>
          <span className="text-muted-foreground mb-5">
            Manager your Agency details
          </span>
          <AgencyDetails data={agencyDetails} />
        </div>
        <Separator className="md:my-6 my-3" />
        <div>
          <h1 className="md:text-xl font-semibold">User Details</h1>
          <span className="text-muted-foreground mb-5">
            Manager your accounts details
          </span>
          <UserDetails
            id={agencyDetails.id}
            type="agency"
            userDetails={userDetails}
            userPermissions={userPermissions}
            subAccounts={subAccounts}
          />
        </div>
      </div>
    </div>
  );
}

import { verifyAndAcceptInvitation } from "@/actions/agency";
import AgencyDetails from "@/components/forms/agency-details";
import UserDropdown from "@/components/sidebar/user-dropdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { Plan, User } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

export default async function AgencyPage({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
  const agencyId = await verifyAndAcceptInvitation();

  //get the users details
  const user = await currentUser();
  if (agencyId) {
    if (user?.role === "SUBACCOUNT_GUEST" || user?.role === "SUBACCOUNT_USER") {
      return redirect("/subaccount");
    } else if (user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN") {
      if (searchParams.plan) {
        return redirect(
          `/agency/${agencyId}/billing?plan=${searchParams.plan}`
        );
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split("___")[0];
        const stateAgencyId = searchParams.state.split("___")[1];
        if (!stateAgencyId) return <div>Not authorized</div>;
        return redirect(
          `/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`
        );
      } else return redirect(`/agency/${agencyId}`);
    } else {
      return <div>Not authorized</div>;
    }
  }

  return (
    <div className="flex flex-col h-full flex-1 p-4">
      <div className="w-full flex justify-end">
        <UserDropdown user={user as User} />
      </div>

      <div className="flex  flex-col mx-auto h-full justify-center items-center space-y-5 md:w-[512px]">
        <h1 className="text-3xl ">Create a new agency</h1>

        <p className="text-lg text-center text-muted-foreground">
          Fill in the details of your new agency to start using our services.
        </p>

        <div className="bg-primary-foreground rounded-md p-6">
          <AgencyDetails />
        </div>
      </div>
    </div>
  );
}

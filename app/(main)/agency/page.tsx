import { verifyAndAcceptInvitation } from "@/actions/agency";
import AgencyDetails from "@/components/forms/agency-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { currentUser } from "@/lib/auth";
import { Plan } from "@prisma/client";
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
    <div className="absolute inset-0 z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="w-full  flex flex-col justify-center items-center p-4 gap-y-4 z-20">
        <Card className="md:w-2/5">
          <CardHeader>
            <CardTitle>Register your company</CardTitle>
            <CardDescription>
              Enter your information to register your company
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="md:w-2/5">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <AgencyDetails />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

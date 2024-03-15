import AgencyDetails from "@/components/forms/agency-details";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plan } from "@prisma/client";
import React from "react";

export default function AgencyPage({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
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

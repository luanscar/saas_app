import AgencyDetails from "@/components/forms/agency-details";
import { Plan } from "@prisma/client";
import React from "react";

export default function AgencyPage({
  searchParams,
}: {
  searchParams: { plan: Plan; state: string; code: string };
}) {
  return (
    <div className="mx-auto p-4 max-w-3xl space-y-8">
      <div className="space-y-2">
        <h1 className="text-xl md:text-3xl font-bold">Register your company</h1>
        <p className="text-sm md:text-lg text-muted-foreground">
          Enter your information to register your company
        </p>
      </div>

      <AgencyDetails />
    </div>
  );
}

import { verifyAndAcceptInvitation } from "@/actions/agency";
import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Unauthorized from "@/components/unauthorized";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: { subaccountId: string };
};
export default async function SubAccountLayoutId({ children, params }: Props) {
  const agencyId = await verifyAndAcceptInvitation();

  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/agency");
  }
  return (
    <div className="w-screen h-screen">
      <Sidebar id={params.subaccountId} type="subaccount" />
      <div className="md:absolute w-screen top-2 h-screen md:left-72">
        <main className="md:border bg-primary-foreground rounded-sm md:w-[calc(100%_-_18.5rem)] md:h-[calc(100%_-_1rem)] ">
          {children}
        </main>
      </div>
    </div>
  );
}

import { verifyAndAcceptInvitation } from "@/actions/agency";
import { getNotificationAndUser } from "@/actions/user";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Unauthorized from "@/components/unauthorized";

import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

type AgencyLayoutIdProps = {
  children: React.ReactNode;
  params: { agencyId: string };
};

export default async function AgencyLayoutId({
  children,
  params,
}: AgencyLayoutIdProps) {
  const agencyId = await verifyAndAcceptInvitation();

  const user = await currentUser();
  if (user?.role !== "AGENCY_OWNER" && user?.role !== "AGENCY_ADMIN") {
    return <Unauthorized />;
  }

  if (!user) {
    return redirect("/");
  }

  if (!agencyId) {
    return redirect("/agency");
  }

  let allNoti: any = [];
  const notifications = await getNotificationAndUser(agencyId);
  if (notifications) allNoti = notifications;

  return (
    <div className="w-screen h-screen">
      <Sidebar id={agencyId} type="agency" />
      <div className="w-screen md:absolute md:top-2 h-screen md:left-72">
        <ScrollArea className="md:border bg-primary-foreground rounded-sm md:w-[calc(100%_-_18.5rem)] h-screen md:h-[calc(100%_-_1rem)] ">
          {children}
        </ScrollArea>
      </div>
    </div>

    // <div className="h-screen ">
    //   <Sidebar id={params.agencyId} type="agency" />

    //   <div className="md:pl-[300px]">
    //     <InfoBar notifications={allNoti} role={allNoti.User?.role} />
    //     <div className="relative">
    //       <BlurPage>{children}</BlurPage>
    //     </div>
    //   </div>
    // </div>
  );
}

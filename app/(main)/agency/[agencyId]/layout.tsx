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
    <div>
      <Sidebar id={agencyId} type="agency" />
      <ScrollArea className="h-screen ">
        <main className="md:ml-72 mb-16 gap-4 p-4 md:gap-8 md:p-10 ">
          {children}
        </main>
      </ScrollArea>
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

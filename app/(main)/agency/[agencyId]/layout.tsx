import { verifyAndAcceptInvitation } from "@/actions/agency";
import { getNotificationAndUser } from "@/actions/user";
import BlurPage from "@/components/global/blur-page";
import InfoBar from "@/components/global/infobar";
import Sidebar from "@/components/sidebar";

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
  if (!user) return;

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
    <div className="h-screen ">
      <Sidebar id={params.agencyId} type="agency" />

      <div className="md:pl-[300px]">
        <InfoBar notifications={allNoti} role={allNoti.User?.role} />
        <div className="relative">
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  );
}

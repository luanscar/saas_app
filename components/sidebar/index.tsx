import React from "react";

import MenuOptions from "./menu-options";
import { getAuthUserDetails } from "@/actions/user";

type SidebarProps = {
  id: string;
  type: "agency" | "subaccount";
};

const Sidebar = async ({ id, type }: SidebarProps) => {
  const user = await getAuthUserDetails();

  if (!user) return null;

  if (!user.Agency) return;

  const details =
    type === "agency"
      ? user.Agency
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id);

  const isWhiteLabeledAgency = user.Agency.whiteLabel;

  if (!details) return;

  let sideBarLogo = user.Agency.agencyLogo || "/assets/plura-logo.svg";

  if (!isWhiteLabeledAgency) {
    if (type === "subaccount") {
      sideBarLogo =
        user?.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.subAccountLogo || user.Agency.agencyLogo;
    }
  }

  const sidebarOpt =
    type === "agency"
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((subaccount) => subaccount.id === id)
          ?.SidebarOption || [];

  const subaccounts = user.Agency.SubAccount.filter((subaccount) =>
    user.Permissions.find(
      (permission) =>
        permission.subAccountId === subaccount.id && permission.access
    )
  );

  return (
    // <Sidebar>
    //   <SidebarHeader className="flex flex-col gap-y-3">
    //     <div className="flex justify-between">
    //       <AgencyDropDown user={user} />
    //       <UserDropdown user={user} />
    //     </div>

    //     <div className="flex gap-1 justify-between">
    //       <Button
    //         variant="outline"
    //         className="w-full flex justify-start gap-1"
    //         size="sm"
    //         onClick={() => {
    //           setOpen(
    //             <CustomModal title="Modal" subheading="subheading">
    //               TODO: criar funcionalidade de novo chat
    //             </CustomModal>
    //           );
    //         }}
    //       >
    //         <ChatBubbleIcon />
    //         New chat
    //       </Button>
    //       <Link href="/search">
    //         <Button variant="outline" size="sm">
    //           <MagnifyingGlassIcon />
    //         </Button>
    //       </Link>
    //     </div>
    //   </SidebarHeader>

    //   <MenuOptions />
    // </Sidebar>

    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOpt}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  );
};

export default Sidebar;

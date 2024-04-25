"use client";
import { Check, CheckCheck, ChevronDown, Menu, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
  User,
} from "@prisma/client";
import Link from "next/link";
import { icons } from "@/lib/constants";
import { useParams, usePathname } from "next/navigation";

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: any;
};

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { Label } from "../ui/label";

const MenuSidebar = ({
  defaultOpen,
  user,
  subAccounts,
  sidebarLogo,
  sidebarOpt,
  details,
}: Props) => {
  const pathname = usePathname();
  const type = pathname.split("/")[1];
  const params = useParams();
  const activePath = pathname.split("/")[3];
  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  return (
    <>
      <Sheet modal={false} {...openState}>
        <SheetTrigger asChild className="absolute top-2.5 z-50 left-2">
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          showX={!defaultOpen}
          side="left"
          className={cn([
            " fixed top-0 !border-0 p-6",
            {
              "hidden md:inline-block z-0 w-72": defaultOpen,
              "inline-block md:hidden z-[100] w-[70%]": !defaultOpen,
            },
          ])}
        >
          <nav className="grid gap-2 text-lg font-medium">
            <div className="flex items-center justify-between">
              <DropdownMenu>
                <DropdownMenuTrigger className="justify-start items-center flex rounded-sm p-1 hover:bg-primary-foreground gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={sidebarLogo} />
                    <AvatarFallback>{details.name}</AvatarFallback>
                  </Avatar>
                  <Label>{details.name}</Label>
                  <ChevronDown size={12} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>Preferences</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={`/${type}/${details.id}/settings`}>
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      Switch Account
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {(user?.role === "AGENCY_OWNER" ||
                          user?.role === "AGENCY_ADMIN") &&
                          user?.Agency && (
                            <div>
                              <DropdownMenuLabel>
                                <span>Agency</span>
                              </DropdownMenuLabel>
                              <DropdownMenuItem className="gap-2 hover:bg-primary-foreground cursor-pointer ">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={user?.Agency?.agencyLogo} />
                                  <AvatarFallback>
                                    {user.Agency.name}
                                  </AvatarFallback>
                                </Avatar>
                                <Link
                                  className="flex flex-1 justify-between items-center "
                                  href={`/agency/${user.Agency.id}`}
                                >
                                  <Label className="cursor-pointer">
                                    {user.Agency.name}
                                  </Label>
                                  {user.agencyId === details.id && (
                                    <Check size={16} />
                                  )}
                                </Link>
                              </DropdownMenuItem>
                            </div>
                          )}

                        {subAccounts.map((subaccount) => {
                          return (
                            <div key={subaccount.id}>
                              <DropdownMenuLabel>
                                <span>Sub Accounts</span>
                              </DropdownMenuLabel>
                              <DropdownMenuItem className="gap-2 hover:bg-primary-foreground cursor-pointer ">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={subaccount.subAccountLogo}
                                  />
                                  <AvatarFallback>
                                    {subaccount.name}
                                  </AvatarFallback>
                                </Avatar>
                                <Link
                                  className="flex justify-between items-center w-full flex-1"
                                  href={`/subaccount/${subaccount.id}`}
                                >
                                  <Label className="cursor-pointer">
                                    {subaccount.name}
                                  </Label>
                                  {subaccount.id === params.subaccountId && (
                                    <Check size={16} />
                                  )}
                                </Link>
                              </DropdownMenuItem>
                            </div>
                          );
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                className="hover:bg-primary-foreground rounded-sm p-1"
                href={`/subaccount/${details.id}/search`}
              >
                <Search size={16} />
              </Link>
            </div>

            {/* {subAccounts.map((subaccount) => {
              return (
                <div
                  key={subaccount.id}
                  className="flex items-center justify-between"
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger className="justify-start items-center flex rounded-sm p-1 hover:bg-primary-foreground gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={subaccount.subAccountLogo} />
                        <AvatarFallback>{subaccount.name}</AvatarFallback>
                      </Avatar>
                      <Label>{subaccount.name}</Label>
                      <ChevronDown size={12} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem>Preferences</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Sub Account Settings</DropdownMenuItem>
                      <DropdownMenuItem>Team</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          Switch Account
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuLabel>
                              {subaccount.companyEmail}
                            </DropdownMenuLabel>
                            <DropdownMenuItem className="gap-2 hover:bg-primary-foreground cursor-pointer ">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={subaccount.subAccountLogo} />
                                <AvatarFallback>
                                  {subaccount.name}
                                </AvatarFallback>
                              </Avatar>
                              <Link
                                className="flex justify-between items-center  flex-1"
                                href={`/subaccount/${subaccount.id}`}
                              >
                                <Label className="cursor-pointer">
                                  {subaccount.name}
                                </Label>
                                {subaccount.id === params.subaccountId && (
                                  <Check size={16} />
                                )}
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Link
                    className="hover:bg-primary-foreground rounded-sm p-1"
                    href={`/subaccount/${subaccount.id}/search`}
                  >
                    <Search size={16} />
                  </Link>
                </div>
              );
            })} */}

            {sidebarOpt.map((sidebarOptions) => {
              let val;

              const result = icons.find(
                (icon) => icon.value === sidebarOptions.icon
              );
              if (result) {
                val = <result.path />;
              }
              return (
                <div
                  key={sidebarOptions.id}
                  className={cn([
                    "hover:bg-primary-foreground rounded-lg",
                    (sidebarOptions.name.toLowerCase() === activePath ||
                      activePath ===
                        sidebarOptions.name
                          .toLowerCase()
                          .replace("sub accounts", "all-subaccounts")) &&
                      "bg-muted rounded-lg",
                  ])}
                >
                  <Link
                    href={sidebarOptions.link}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                  >
                    {val}
                    <span className="text-base">{sidebarOptions.name}</span>
                  </Link>
                </div>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MenuSidebar;

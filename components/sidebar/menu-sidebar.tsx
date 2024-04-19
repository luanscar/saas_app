"use client";
import { CircleUser, Menu, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserDropdown from "./user-dropdown";
import {
  Agency,
  AgencySidebarOption,
  SubAccount,
  SubAccountSidebarOption,
  User,
} from "@prisma/client";
import Link from "next/link";
import { icons } from "@/lib/constants";
import { usePathname } from "next/navigation";

type Props = {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[];
  sidebarLogo: string;
  details: any;
  user: Partial<User>;
};

const MenuSidebar = ({
  defaultOpen,
  user,
  sidebarLogo,
  sidebarOpt,
  details,
}: Props) => {
  const pathname = usePathname();
  const activePath = pathname.split("/")[3];
  const openState = useMemo(
    () => (defaultOpen ? { open: true } : {}),
    [defaultOpen]
  );

  return (
    <>
      <div className="flex flex-col">
        <header
          className={cn([
            "flex h-14 items-center border-b bg-muted/40 gap-4   px-4 ",
            { "md:ml-72 lg:h-[60px] lg:px-6 ": defaultOpen },
            { hidden: !defaultOpen },
          ])}
        >
          <div className="w-full flex-1 ml-10 md:ml-0">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <UserDropdown user={user} />
        </header>
      </div>

      <Sheet modal={false} {...openState}>
        <SheetTrigger asChild className="absolute top-2.5 left-2">
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          showX={!defaultOpen}
          side="left"
          className={cn([
            " fixed top-0 border-r-[1px] p-6",
            {
              "hidden md:inline-block z-0 w-72": defaultOpen,
              "inline-block md:hidden z-[100] w-full": !defaultOpen,
            },
          ])}
        >
          <nav className="grid gap-2 text-lg font-medium">
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
                    "",
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

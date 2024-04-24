"use client";

import { SubAccount } from "@prisma/client";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { SheetClose } from "../ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { Compass, ChevronsUpDown } from "lucide-react";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";

interface AccountSwitcherProps {
  defaultOpen?: boolean;
  subAccounts: SubAccount[];
  sidebarLogo: string;
  details: any;
  user: any;
}

export function AccountSwitcher({
  details,
  sidebarLogo,
  subAccounts,
  user,
  defaultOpen,
}: AccountSwitcherProps) {
  return (
    <div>
      <AspectRatio ratio={16 / 5}>
        <Image
          src={sidebarLogo}
          alt="Sidebar Logo"
          fill
          className="rounded-md object-contain"
        />
      </AspectRatio>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className="w-full my-4 flex items-center justify-between py-8"
            variant="ghost"
          >
            <div className="flex items-center text-left gap-2">
              <Compass />
              <div className="flex flex-col">
                {details.name}
                <span className="text-muted-foreground">{details.address}</span>
              </div>
            </div>
            <div>
              <ChevronsUpDown size={16} className="text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 h-80 mt-4 z-[200]">
          <Command className="rounded-lg">
            <CommandInput placeholder="Search Accounts..." />
            <CommandList className="pb-16">
              <CommandEmpty> No results found</CommandEmpty>
              {(user?.role === "AGENCY_OWNER" ||
                user?.role === "AGENCY_ADMIN") &&
                user?.Agency && (
                  <CommandGroup heading="Agency">
                    <CommandItem className="!bg-transparent my-2 text-primary broder-[1px] border-border p-2 rounded-md hover:!bg-muted cursor-pointer transition-all">
                      {defaultOpen ? (
                        <Link
                          href={`/agency/${user?.Agency?.id}`}
                          className="flex gap-4 w-full h-full"
                        >
                          <div className="relative w-16">
                            <Image
                              src={user?.Agency?.agencyLogo}
                              alt="Agency Logo"
                              fill
                              className="rounded-md object-contain"
                            />
                          </div>
                          <div className="flex flex-col flex-1">
                            {user?.Agency?.name}
                            <span className="text-muted-foreground">
                              {user?.Agency?.address}
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <SheetClose asChild>
                          <Link
                            href={`/agency/${user?.Agency?.id}`}
                            className="flex gap-4 w-full h-full"
                          >
                            <div className="relative w-16">
                              <Image
                                src={user?.Agency?.agencyLogo}
                                alt="Agency Logo"
                                fill
                                className="rounded-md object-contain"
                              />
                            </div>
                            <div className="flex flex-col flex-1">
                              {user?.Agency?.name}
                              <span className="text-muted-foreground">
                                {user?.Agency?.address}
                              </span>
                            </div>
                          </Link>
                        </SheetClose>
                      )}
                    </CommandItem>
                  </CommandGroup>
                )}
              <CommandGroup heading="Accounts">
                {!!subAccounts
                  ? subAccounts.map((subaccount) => (
                      <CommandItem key={subaccount.id}>
                        {defaultOpen ? (
                          <Link
                            href={`/subaccount/${subaccount.id}`}
                            className="flex gap-4 w-full h-full"
                          >
                            <div className="relative w-16">
                              <Image
                                src={subaccount.subAccountLogo}
                                alt="subaccount Logo"
                                fill
                                className="rounded-md object-contain"
                              />
                            </div>
                            <div className="flex flex-col flex-1">
                              {subaccount.name}
                              <span className="text-muted-foreground">
                                {subaccount.companyEmail}
                              </span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link
                              href={`/subaccount/${subaccount.id}`}
                              className="flex gap-4 w-full h-full"
                            >
                              <div className="relative w-16">
                                <Image
                                  src={subaccount.subAccountLogo}
                                  alt="subaccount Logo"
                                  fill
                                  className="rounded-md object-contain"
                                />
                              </div>
                              <div className="flex flex-col flex-1">
                                {subaccount.name}
                                <span className="text-muted-foreground">
                                  {subaccount.companyEmail}
                                </span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    ))
                  : "No Accounts"}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

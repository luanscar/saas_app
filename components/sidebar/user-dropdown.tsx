"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";

import {
  LockClosedIcon,
  MixerVerticalIcon,
  RocketIcon,
} from "@radix-ui/react-icons";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";

type UserDropdownProps = {
  user: Partial<User>;
};

export default function UserDropdown({ user }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className="relative rounded-full hover:bg-muted-foreground !py-0 h-8 w-8 flex items-center !px-0"
        >
          <Avatar className="h-8 w-8  ring-0">
            <AvatarImage src={user.image as string} alt={user.name as string} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <MixerVerticalIcon className="w-3 h-3 mr-3" />
            Configuraçoes
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RocketIcon className="w-3 h-3 mr-3" />
            Upgrade
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LockClosedIcon className="w-3 h-3 mr-3" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

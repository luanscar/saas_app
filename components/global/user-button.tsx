import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LockClosedIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { Role, User } from "@prisma/client";

type UserProps = {
  user:
    | {
        id: string;
        name: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        password: string | null;
        createdAt: Date;
        updatedAt: Date;
        role: Role;
        agencyId: string | null;
      }
    | undefined;
};

export default async function UserButton({ user }: UserProps) {
  if (!user) return;
  return (
    <div className="flex gap-2 items-center">
      <span className="hidden text-sm sm:inline-flex">{user.email}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-8 h-8 rounded-full">
            <Avatar className="w-8 h-8">
              {user.image && (
                <AvatarImage src={user.image} alt={user.name ?? ""} />
              )}
              <AvatarFallback>{user.email}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer hover:bg-muted"
            onClick={() => signOut()}
          >
            <LockClosedIcon className="w-3 h-3 mr-3" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

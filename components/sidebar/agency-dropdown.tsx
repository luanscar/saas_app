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

import { LockClosedIcon, RocketIcon } from "@radix-ui/react-icons";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Label } from "../ui/label";

type UserDropdownProps = {
	user: Session["user"];
};

export default function AgencyDropDown({ user }: UserDropdownProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="sm"
					className="relative h-8 flex items-center  space-x-2 p-1"
				>
					<Avatar className="h-6 w-6 rounded-md ring-0">
						<AvatarImage src={user.image as string} alt={user.name as string} />
						<AvatarFallback>E</AvatarFallback>
					</Avatar>
					<Label className="">Encom</Label>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="start" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-xs leading-none text-muted-foreground">{user.email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem className="flex gap-2">
						<div className="w-6 h-6 flex items-center justify-center text-white bg-lime-600 rounded-md">
							<p>E</p>
						</div>
						<Label>Encom</Label>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
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

"use client";
import React from "react";
import {
	Sidebar,
	SidebarHeader,
	SidebarMain,
	SidebarNavLink,
	SidebarNavMain,
} from ".";
import AgencyDropDown from "./agency-dropdown";
import UserDropdown from "./user-dropdown";
import { Button } from "../ui/button";
import {
	ChatBubbleIcon,
	HomeIcon,
	MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Session } from "next-auth";
import { useModal } from "@/app/providers/modal-provider";
import CustomModal from "../global/custom-modal";
import { redirect } from "next/navigation";
import Link from "next/link";
import CrossOne from "../icons/close";
import { icons } from "@/lib/constants";

type MainSidebarProps = {
	user: Session["user"];
};

export default function MainSidebar({ user }: MainSidebarProps) {
	const { setOpen } = useModal();
	return (
		<Sidebar>
			<SidebarHeader className="flex flex-col gap-y-3">
				<div className="flex justify-between">
					<AgencyDropDown user={user} />
					<UserDropdown user={user} />
				</div>

				<div className="flex gap-1 justify-between">
					<Button
						variant="outline"
						className="w-full flex justify-start gap-1"
						size="sm"
						onClick={() => {
							setOpen(
								<CustomModal title="Modal" subheading="subheading">
									TODO: criar funcionalidade de novo chat
								</CustomModal>
							);
						}}
					>
						<ChatBubbleIcon />
						New chat
					</Button>
					<Link href="/search">
						<Button variant="outline" size="sm">
							<MagnifyingGlassIcon />
						</Button>
					</Link>
				</div>
			</SidebarHeader>

			<SidebarMain>
				<SidebarNavMain className="flex flex-col flex-grow">
					<SidebarNavLink href="/dashboard" active>
						<HomeIcon className="w-3 h-3 mr-3" />
						Dashboard
					</SidebarNavLink>
				</SidebarNavMain>
			</SidebarMain>
		</Sidebar>
	);
}

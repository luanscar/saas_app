"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export type SidebarGenericProps<T = unknown> = {
	children: React.ReactNode;
	className?: string;
} & T;

export const Sidebar = ({ children, className }: SidebarGenericProps) => {
	return (
		<aside
			className={cn([
				"border-r border-border flex flex-col space-y-6 w-[298px]",
				className,
			])}
		>
			{children}
		</aside>
	);
};

export type SidebarLogoProps = {
	label?: string;
	image: string;
	href?: string;
	className?: string;
};

export const SidebarMain = ({ children, className }: SidebarGenericProps) => {
	return <aside className={cn(["", className])}>{children}</aside>;
};

export const SidebarHeader = ({ children, className }: SidebarGenericProps) => {
	return <aside className={cn(["p-3 w-full", className])}>{children}</aside>;
};

export const SidebarNavHeader = ({
	children,
	className,
}: SidebarGenericProps) => {
	return <aside className={cn(["", className])}>{children}</aside>;
};

type SidebarNavLinkProps = {
	href: string;
	active?: boolean;
};

export const SidebarNavLink = ({
	children,
	className,
	href,
	active,
}: SidebarGenericProps<SidebarNavLinkProps>) => {
	return (
		<Link
			href={href}
			className={cn(["flex items-center text-md px-3 py-2 rounded-md", className])}
		>
			{children}
		</Link>
	);
};

export const SidebarNavHeaderTitle = ({
	children,
	className,
}: SidebarGenericProps) => {
	return <aside className={cn(["", className])}>{children}</aside>;
};

export const SidebarNav = ({ children, className }: SidebarGenericProps) => {
	return <aside className={cn(["", className])}>{children}</aside>;
};

export const SidebarNavMain = ({
	children,
	className,
}: SidebarGenericProps) => {
	return <aside className={cn(["flex flex-col", className])}>{children}</aside>;
};

export const SidebarSearch = ({ children, className }: SidebarGenericProps) => {
	return <aside className={cn(["flex flex-col", className])}>{children}</aside>;
};
